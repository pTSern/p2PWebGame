import * as cc from 'cc';
import pFunction from './pFunction';
import pArray from './pArray';

export namespace pComponent {

    export type TFlexTarget = cc.Node | cc.Component;
    export type TEventType = string | cc.NodeEventType;

    interface _IEventTarget {
        _target: TFlexTarget;
        _handlers: pFlex.TArray<pFunction.TType>
        _capture?: any;
    }

    interface _IEventBinders {
        _options: pFlex.TArray<_IEventTarget>
        _type: TEventType;
        _binder?: any;
    }

    interface _IEventRemover {
        _target: pFlex.TArray<TFlexTarget>;
        _type: string | cc.NodeEventType;
    }

    interface _IEventBinder {
        _target: TFlexTarget;
        _type: TEventType;
        _handler: pFunction.TType;
        _binder?: any;
        _capture?: any;
    }

    export function adds(_event: pFlex.TArray<_IEventBinders>, ..._events: _IEventBinders[]) {
        _events = pArray.flatter(_event, ..._events);

        for(const event of _events) {
            const { _binder, _options, _type } = event;

            for(const _option of pArray.flatter(_options)) {
                const { _target, _handlers, _capture } = _option;
                const _node = _target instanceof cc.Node ? _target : _target.node;

                for(const _handler of pArray.flatter(_handlers)) {
                    _node.on(_type, _handler, _binder, _capture);
                }
            }
        }
    }

    export function binds<TTarget extends cc.Component, TBinder extends cc.Component, TProtected extends boolean = false>(target: TTarget, key: pFlex.TKeyOf<TTarget, cc.EventHandler[]>, binder: TBinder, handler: TProtected extends false ? pFlex.TKeyOf<TBinder, Function> : string) {
        const _class = cc.js.getClassName(binder);
        const _node = binder.node;

        const _handler = new cc.EventHandler();
        _handler.target = _node;
        _handler.component = _class;
        _handler.handler = handler as string;

        (target[key] as cc.EventHandler[]).push(_handler);
    }

    export function remove(_event: pFlex.TArray<_IEventRemover>, ..._events: _IEventRemover[]) {
        _events = pArray.flatter(_event, ..._events);

        _events.forEach( event => {
            const { _target, _type } = event;
            const targets = pArray.flatter(_target);
            targets.forEach( _target => {
                const _node = _target instanceof cc.Node ? _target : _target.node;

                _node.targetOff(_type);
            })
        } )
    }
}

export default pComponent;
