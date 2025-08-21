import { _decorator, Component } from "cc";
import pEvent from "../utils/pEvent";
import pFunction from "../utils/pFunction";

const { ccclass } = _decorator;

@ccclass('EventComponent')
export class EventComponent<TEvent extends pFlex.TKey> extends Component implements pEvent.IDriver<TEvent> {
    private _handler: pEvent.Handler<TEvent> = null;

    protected get _event() { return this._handler ??= pEvent.Handler.create() }

    set(event: TEvent, listener: pFlex.TArray<pFunction.THandler>, ...listeners: pFunction.THandler[]): void {
        this._event.set(event, listener, ...listeners);
    }

    add(event: TEvent, listener: pFlex.TArray<pFunction.THandler>, ...listeners: pFunction.THandler[]): void {
        this._event.add(event, listener, ...listeners);
    }

    remove(event: TEvent, listener: pFlex.TArray<pFunction.THandler>, ...listeners: pFunction.THandler[]): void {
        this._event.remove(event, listener, ...listeners);
    }

    invoke(event: TEvent, ...args: any[]): any[] {
        return this._event.invoke(event, ...args);
    }

    clear(_event: TEvent): void {
        this._event.clear(_event);
    }

    wait(event: TEvent): Promise<void> {
        return this._event.wait(event);
    }

    public on(_events: pEvent.TFlex<TEvent>, _priority: number = 0) {
        this._event.on(_events);
    }

    public off(_events: pEvent.TFlex<TEvent>) {
        this._event.off(_events);
    }
}
