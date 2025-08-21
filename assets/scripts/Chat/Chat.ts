import { Button, Component, EditBox, _decorator } from "cc";
import pComponent from "../utils/pComponent";
import { Connection } from "../core/Connection";
import pConsoler from "../utils/pConsoler";
import EventManager from "../event/EventManager";
import pEvent from "../utils/pEvent";
import { NSEventDefine } from "../event/EventDefine";
import p2PConnector from "../core/p2PConnector";

const { ccclass, type } = _decorator;

@ccclass("Chat")
export class Chat extends Component {
    @type(Button) btn_send!: Button;
    @type(EditBox) edit_chat!: EditBox;

    protected onLoad(): void {
        pComponent.adds( 
            {
                _options: [
                    { _handlers: this._act_send, _target: this.btn_send },
                ],
                _type: Button.EventType.CLICK,
                _binder: this
            }
        )
        p2PConnector.on([
            ['onMessage', this._on_message, this]
        ]);
    }

    onDestroy(): void {
        p2PConnector.off_from_binder(this);
    }

    protected _act_send() {
        p2PConnector.dc.send(this.edit_chat.string);
        pConsoler.log("You: " + this.edit_chat.string);
    }

    private _on_message(msg: string) {
        pConsoler.log("Peer: " + msg);
    }
}
