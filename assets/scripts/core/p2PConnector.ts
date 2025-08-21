import Constant from "../Config/Constant";
import { pCrypto } from "../utils/pCrypto";
import pEvent from "../utils/pEvent";

//export namespace p2PConnector {
    export type _TEvent = 'onHaveOffer' | 'onHaveAnswer' | 'onDataChannel' | 'onConnected' | 'onMessage'
    class _p2PConnector extends pEvent.Handler<_TEvent> {
        protected _pc: RTCPeerConnection;
        protected _dc: RTCDataChannel = null;

        get dc() { return this._dc }

        protected static _create() {
            return new _p2PConnector();
        }

        protected _init(_opt?: pEvent.IOption<_TEvent, any>): void {
        this.log("Creating PeerConnection...");
            super._init(_opt);

            this._pc = new RTCPeerConnection( {
                iceServers: [ { urls: Constant.ice_server_url } ]
            } )

            this._pc.onicecandidate = _event => {
                _event.candidate
                    ? this.log("Ice candidate:", _event.candidate.candidate)
                    : this.log("Ice candidate gathering complete");

                const { localDescription, signalingState } = this._pc;
                if(localDescription) {
                    switch(signalingState) {
                        case "have-local-offer":
                        case "stable": {
                            break;
                        }
                        case "have-local-pranswer":
                        case "have-remote-offer": {
                            break;
                        }
                    }
                }
            }

            this._pc.ondatachannel = _event => {
                this._dc = _event.channel;
                this.invoke('onDataChannel', _event.channel);
            }

            this.make_offer();
        }

        protected _is_making: boolean = false;
        async apply_offer(message: string) {
            const _offer = await pCrypto.unpacker(message);
            await this._pc.setRemoteDescription(_offer);
            const _answer = await this._pc.createAnswer();
            await this._pc.setLocalDescription(_answer);

            await this._wait_for_ice_gathering_complete();
            const _out = await pCrypto.packer(this._pc.localDescription);
            this.invoke('onHaveAnswer', _out);
            return _out;
        }

        async make_offer() {
            if(this._is_making) return "";
            this.log("Making offer...");
            this._is_making = true;
            const _dc = this._pc.createDataChannel('chat', { ordered: true });
            this._setdc(_dc);

            const _offer = await this._pc.createOffer();
            await this._pc.setLocalDescription(_offer);

            await this._wait_for_ice_gathering_complete();
            const _out = await pCrypto.packer(this._pc.localDescription);
            this.invoke('onHaveOffer', _out);
            this._is_making = false;
            return _out;
        }

        async apply_answer(message: string) {
            const _answer = await pCrypto.unpacker(message);
            await this._pc.setRemoteDescription(_answer);
            this.invoke('onConnected');
        }

        protected _wait_for_ice_gathering_complete(): Promise<void> {
            if(this._pc.iceGatheringState === 'complete') return Promise.resolve();

            return new Promise<void>( _rs => {
                const _check = () => {
                    if(this._pc.iceGatheringState === 'complete') {
                        this._pc.removeEventListener('icegatheringstatechange', _check);
                        _rs();
                    }
                }
                this._pc.addEventListener('icegatheringstatechange', _check);
            })
        }

        protected _setdc(_dc: RTCDataChannel) {
            this._dc = _dc;
            this._dc.onmessage = _event => this.invoke('onMessage', _event.data);
        }
    }

    const _ret = _p2PConnector.create({ alias: 'p2PConnector', global: true }) as _p2PConnector;
//}
export default _ret;
