import Constant from "../Config/Constant";
import EventManager from "../event/EventManager";
import pConsoler from "../utils/pConsoler";

const _pc = new RTCPeerConnection( {
    iceServers: [ { urls: Constant.ice_server_url } ]
} )

const log = pConsoler.log.bind(pConsoler, "[RTCPeerConnection] Log >");

_pc.onicecandidate = _event => {
    _event.candidate
        ? log("Ice candidate:", _event.candidate.candidate)
        : log("Ice candidate gathering complete");

    const { localDescription, signalingState } = _pc;
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

_pc.ondatachannel = _event => {
    EventManager.invoke('onRTCDataChannel', _event.channel);
}

export default _pc;
