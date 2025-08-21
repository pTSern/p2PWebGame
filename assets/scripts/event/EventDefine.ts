
export namespace NSEventDefine {
    export const events = [
        'onRTCHaveOffer', 'onRTCHaveAnswer', 'onRTCDataChannel',
        'onConnected', 'onMessage'

    ] as const;

    export type TEvents = typeof events[number];

}
