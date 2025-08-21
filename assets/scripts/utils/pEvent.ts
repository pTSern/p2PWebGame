
import pFunction from './pFunction';
import pArray from './pArray';

export namespace pEvent {
    export interface IHandler {
        _function: pFunction.TType;
        _priority: number;
    }

    export type TFlex<TEvent extends pFlex.TKey> = [TEvent, pFunction.TType, any, number?, pFlex.TArray<any>?][];

    export interface IDriver<TEventType extends pFlex.TKey> {
        add(event: TEventType, listener: pFlex.TArray<pFunction.THandler>, ...listeners: pFunction.THandler[]): void
        remove(event: TEventType, listener: pFlex.TArray<pFunction.THandler>, ...listeners: pFunction.THandler[]): void
        set(event: TEventType, listener: pFlex.TArray<pFunction.THandler>, ...listeners: pFunction.THandler[]): void
        clear(event: TEventType): void
        invoke(event: TEventType, ...args: any[]): any[];
    }

    interface _IOption<TEvent extends pFlex.TKey, TSelf = any> {
        log?: boolean;
        alias?: string;
        global?: boolean;

        key?: (key: any) => TEvent;
        after?: (self: TSelf) => void;
    }

    export class Handler<TEvent extends pFlex.TKey> implements IDriver<TEvent> {
        public static create<TEvent extends pFlex.TKey>(opt?: _IOption<TEvent, Handler<TEvent>>) {
            const ret = new Handler<TEvent>();
            ret._init(opt);
            return ret;
        }

        constructor() {
            this.log = console.log.bind(console, `${this.__alias_} Log:`);
            this.error = console.error.bind(console, `${this.__alias_} Error:`);
            this.warn = console.warn.bind(console, `${this.__alias_} Warning:`);
        }

        protected _init(
            {
                key = (_key: any) => _key as TEvent,
                log = false,
                alias = '[EventDriver]',
                after = () => {},
                global = false
            }: _IOption<TEvent> = {}): void 
        {
            global && ((globalThis as any)[alias] = this);
            this.__key_   = key;
            this.__log_   = log;
            this.__alias_ = alias;
            after(this);
        }

        public log: pFunction.TType;
        public error: pFunction.TType;
        public warn: pFunction.TType;

        protected __waiters_: Partial<Record<TEvent, Promise<void>>> = {}

        protected __log_: boolean = false;
        protected __alias_: string = '[EventDriver]';
        protected __key_: (key: any) => TEvent = (key: any) => key as TEvent;
        protected __events_: Partial<Record<TEvent, pFunction.IBinder[]>> = {};

        async wait(key: TEvent) {
            const _key = this.__key_(key);
            const _otps = this._get(key);

            const _wait = this.__waiters_[_key];
            if(!_wait) this.__waiters_[_key] = new Promise<void>( _rs => _otps.push(...this._map([() => _rs && _rs()])) )
            await this.__waiters_[_key];
        }

        protected _actResetWaiter(key: TEvent) {
            const _key = this.__key_(key);
            const _otps = this._get(key);

            this.__waiters_[_key] = new Promise<void>( _rs => _otps.push(...this._map([() => _rs && _rs()])) )
        }

        protected _get(key: TEvent) {
            key = this.__key_(key);

            this.__events_ ??= {};
            this.__events_[key] ??= [];
            return this.__events_[key];
        }

        is_empty(key: TEvent) {
            return this._get(key).length <= 0;
        }

        protected _set(key: TEvent, value: pFunction.IBinder[]) {
            key = this.__key_(key);

            this.__events_ ??= {};
            this.__events_[key] = value;
        }

        protected _map(listener: pFunction.THandler[]): pFunction.IBinder[] {
            return listener.map( ret => ( typeof ret === 'function' )
                    ? { _function: ret, _priority: 0, _this: null, _args: undefined }
                    : { _function: ret._function, _this: ret._this, _priority: ret._priority ?? 0, _args: ret._args }
            );
        }

        set(event: TEvent, listener: pFlex.TArray<pFunction.THandler>, ...listeners: pFunction.THandler[]): void {
            this._set(event, []);
            this.add(event, listener, ...listeners);
        }

        add(event: TEvent, listener: pFlex.TArray<pFunction.THandler>, ...listeners: pFunction.THandler[]): void {
            listeners = pArray.flatter(listener, ...listeners);

            const opts = this._get(event);
            opts.push(...this._map(listeners));
            opts.sort((a, b) => a._priority - b._priority);
        }

        remove(event: TEvent, listener: pFlex.TArray<pFunction.THandler>, ...listeners: pFunction.THandler[]): void {
            listeners = pArray.flatter(listener, ...listeners);

            const map = this._map(listeners);
            const opts = this._get(event).filter( opt => {
                const index = map.findIndex( _opt => _opt._function === opt._function && _opt._this === opt._this )
                if(index < 0) return true;

                map.splice(index, 1);
                return false;
            })

            this._set(event, opts);
        }

        clear(event: TEvent): void {
            this._set(event, []);
        }

        invoke(event: TEvent, ...args: any[]): any[] {
            try {
                const _key = this.__key_(event);
                const list = this._get(event);
                if(!_key || !list) return;

                const results = list.map(({ _this, _function, _args }) => {
                    _args = _args ?? [];
                    _this ? _function.call(_this, ...args, ..._args) : _function(...args, ..._args)
                });

                this.__waiters_[_key] = Promise.resolve();

                this.__log_ && this.log(`${this.__alias_} Log: Invoked`, this.__key_(event), "with arguments: ", args, "\t\t Listeners: ", list);
                return results;
            } catch (e) {
                this.error(`${this.__alias_} Log: Error`, e);
                return []
            }
        }

        on(events: TFlex<TEvent>) {
            for(const [ _key, _function, _this, _priority, _args ] of events) this.add(_key, { _function, _this, _priority, _args });
        }

        off(events: TFlex<TEvent>) {
            for(const [ _key, _function, _this ] of events) this.remove(_key, { _function, _this });
        }
    }

}

export default pEvent;
