import { Button, Component, EditBox, _decorator } from "cc";
import pComponent from "../utils/pComponent";
import { Connection } from "../core/Connection";
import pConsoler from "../utils/pConsoler";
import EventManager from "../event/EventManager";
import pEvent from "../utils/pEvent";
import { NSEventDefine } from "../event/EventDefine";

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
        EventManager.on(this._events);
    }

    onDestroy(): void {
        EventManager.off(this._events);
    }

    private _events: pEvent.TFlex<NSEventDefine.TEvents> = [
        ['onMessage', this._on_message, this]
    ]

    protected _act_send() {
        Connection.instance.dc.send(this.edit_chat.string);
        pConsoler.log("You: " + this.edit_chat.string);
    }

    private _on_message(msg: string) {
        pConsoler.log("Peer: " + msg);
    }
}
