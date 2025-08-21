import { _decorator, Button, Component, EditBox, instantiate, Prefab } from 'cc';
import pComponent from '../utils/pComponent';
import p2PConnector from './p2PConnector';
import { pCrypto } from '../utils/pCrypto';
import EventManager from '../event/EventManager';
import { NSEventDefine } from '../event/EventDefine';
import pEvent from '../utils/pEvent';

const { ccclass, type } = _decorator;

@ccclass('Connection')
export class Connection extends Component {
    @type(Button) btn_create_offer!: Button;
    @type(Button) btn_apply_offer!: Button;
    @type(Button) btn_apply_answer!: Button;

    @type(EditBox) edit_offer!: EditBox;
    @type(EditBox) edit_answer!: EditBox;

    @type(Prefab) prefab!: Prefab;

    public static get instance() { return this._instance; }
    protected static _instance: Connection = null;

    protected onLoad(): void {
        Connection._instance = this;
        pComponent.adds( 
            {
                _options: [
                    { _handlers: this._act_apply_offer, _target: this.btn_apply_offer },
                    { _handlers: this._act_create_offer, _target: this.btn_create_offer },
                    { _handlers: this._act_apply_answer, _target: this.btn_apply_answer }
                ],
                _type: Button.EventType.CLICK,
                _binder: this
            }
        )
        EventManager.on(this._events);
        this._act_create_offer();
    }

    protected onDestroy(): void {
        Connection._instance = null;
        EventManager.off(this._events);
        this._dc = null;
    }

    private _events: pEvent.TFlex<NSEventDefine.TEvents> = [
        ['onRTCDataChannel', this._on_chanel, this],
    ]

    protected _dc: RTCDataChannel = null;
    get dc() { return this._dc }

    protected async _act_apply_offer() {
        const _offer = await pCrypto.unpacker(this.edit_offer.string);
        await p2PConnector.setRemoteDescription(_offer);
        const _answer = await p2PConnector.createAnswer();
        await p2PConnector.setLocalDescription(_answer);

        await this._wait_for_ice_gathering_complete();
        this.edit_answer.string = await pCrypto.packer(p2PConnector.localDescription);
    }

    protected async _act_create_offer() {
        const _dc = p2PConnector.createDataChannel('chat', { ordered: true });
        this._setdc(_dc);

        const _offer = await p2PConnector.createOffer();
        await p2PConnector.setLocalDescription(_offer);

        await this._wait_for_ice_gathering_complete();
        const _out = await pCrypto.packer(p2PConnector.localDescription);
        console.log('Create Offer', _out);
        this.edit_offer.string = _out;
    }

    protected async _act_apply_answer() {
        const _answer = await pCrypto.unpacker(this.edit_answer.string);
        await p2PConnector.setRemoteDescription(_answer);
        EventManager.invoke('onConnected')

        this._ready();
    }

    protected _ready() {
        const _prefab = instantiate(this.prefab);
        this.node.parent.addChild(_prefab);
    }

    protected _wait_for_ice_gathering_complete(): Promise<void> {
        if(p2PConnector.iceGatheringState === 'complete') return Promise.resolve();

        return new Promise<void>( _rs => {
            const _check = () => {
                if(p2PConnector.iceGatheringState === 'complete') {
                    p2PConnector.removeEventListener('icegatheringstatechange', _check);
                    _rs();
                }
            }
            p2PConnector.addEventListener('icegatheringstatechange', _check);
        })
    }

    protected _on_chanel(_channel: RTCDataChannel) {
        this._setdc(_channel);
        this._ready();
    }

    protected _setdc(_dc: RTCDataChannel) {
        this._dc = _dc;
        this._dc.onmessage = _event => EventManager.invoke('onMessage', _event.data);
    }

}
