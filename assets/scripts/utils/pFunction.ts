import pArray from "./pArray";
import pConsoler from "./pConsoler";

export namespace pFunction {

	export type TType<TArgs = any[], TReturn = any> = TArgs extends any[] 
	    ? (...args: TArgs) => TReturn 
	    : (...args: TArgs[]) => TReturn;

	export interface IBinder<TArgs = any, TReturn = any> {
	    _function: TType<TArgs, TReturn>;
	    _priority?: number;
	    _this: any;
	    _args?: TArgs;
	}
	
	export type THandler<TArgs = any[], TReturn = any, TBinder extends IBinder = IBinder<TArgs, TReturn>> = TType<TArgs, TReturn> | TBinder;
	
    export function map(listener: THandler[]): IBinder[] {
        return listener.map( ret => ( typeof ret === 'function' )
                ? { _function: ret, _priority: 0, _this: null, _args: undefined }
                : { _function: ret._function, _this: ret._this, _priority: ret._priority ?? 0, _args: ret._args }
        );
    }

    export function invoker(listener: pFlex.TArray<THandler>, ...args: any[]) {
        listener = pArray.flatter(listener);
        const _listeners = map(listener);

        const _results = [];
        for(const { _this, _function, _args } of _listeners) {
            try {
                const res = _this ? _function.call(_this, ...args, ...(_args ?? [])) : _function(...args, ...(_args ?? []));
                _results.push(res);
            } catch (_err) {
                pConsoler.error('Error invoking listener:', _err);
            }
        }
        return _results;
    }
}

export default pFunction;
