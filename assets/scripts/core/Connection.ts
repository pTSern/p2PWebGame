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

    protected onLoad(): void {
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

        p2PConnector.on([
            ['onDataChannel', this._ready, this],
            ['onConnected', this._ready, this],
            ['onHaveOffer', this._on_have_offer, this],
            ['onHaveAnswer', this._on_have_answer, this],
        ])
    }

    protected _on_have_answer(_answer: string) {
        this.edit_answer.string = _answer;
    }

    protected _on_have_offer(_offer: string) {
        this.edit_offer.string = _offer;
    }

    protected _act_create_offer() {
        p2PConnector.make_offer();
    }

    protected _act_apply_offer() {
        const _offer = this.edit_offer.string;
        _offer && p2PConnector.apply_offer(_offer);
    }

    protected _act_apply_answer() {
        const _answer = this.edit_answer.string;
        _answer && p2PConnector.apply_answer(_answer);
    }

    protected onDestroy(): void {
        p2PConnector.off_from_binder(this);
    }

    protected _ready() {
        const _prefab = instantiate(this.prefab);
        this.node.parent.addChild(_prefab);
        this.node.destroy();
    }
}
