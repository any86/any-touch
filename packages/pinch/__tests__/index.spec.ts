import { create } from '@testUtils';
import Pinch from '@any-touch/pinch';
import AnyTouch from '@any-touch/core';
import { GestureSimulator, sleep } from '@any-touch/simulator';
const PINCH_NAME = 'pinch';

test(`双手捏合缩小`, async done => {
    const { mockCB } = create();
    AnyTouch.use(Pinch);
    const el = document.createElement('div');
    const at = new AnyTouch(el);
    const gs = new GestureSimulator(el);
    at.on(PINCH_NAME, ev => {
        mockCB(ev.type)
    });

    gs.dispatchTouchStart([{ x: 0, y: 0 }, { x: 10, y: 0 }]);
    gs.dispatchTouchMove([{ x: 0, y: 0 }, { x: 20, y: 0 }]);
    gs.dispatchTouchMove([{ x: 0, y: 0 }, { x: 30, y: 0 }]);
    gs.dispatchTouchEnd();
    await sleep();
    expect(mockCB).toHaveBeenCalledTimes(2);
    // expect(mockCB).toHaveBeenNthCalledWith(1, PINCH_NAME);
    done();
});