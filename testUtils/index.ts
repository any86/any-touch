import AnyTouch from '@any-touch/core';
import { GestureSimulator, sleep } from '@any-touch/simulator';
export function create() {
    const el = document.createElement('div');
    const at = new AnyTouch(el);
    const gs = new GestureSimulator(el);
    const mouse = new GestureSimulator(el, {device:'mouse'});
    const mockCB = jest.fn();
    const { mock } = mockCB;
    const mockCalls = mock.calls;
    const{ start: dispatchTouchStart, cancel: dispatchTouchCancel, end: dispatchTouchEnd, move: dispatchTouchMove } = gs;
    return {
        GestureSimulator,
        dispatchTouchStart,
        dispatchTouchCancel,
        dispatchTouchEnd,
        dispatchTouchMove,
        gs,
        mouse,
        touch:gs,
        at,
        el,
        mockCB,
        mock,
        AnyTouch,
        sleep,
        mockCalls
    };
}
