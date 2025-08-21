import pEvent from "../utils/pEvent";
import { NSEventDefine } from "./EventDefine";

const _pEvent = pEvent.Handler.create<NSEventDefine.TEvents>(
    {
        log: true,
        alias: 'pEventManager',
        global: true
    }
);

export default _pEvent;

