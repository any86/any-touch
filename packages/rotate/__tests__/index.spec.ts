import { create } from '@testUtils';
import Rotate from '@any-touch/rotate';
import AnyTouch from '@any-touch/core';
import { GestureSimulator, sleep } from '@any-touch/simulator';
const ROTATE_NAME = 'rotate';

test(`旋转`, async done => {
    const { mockCB } = create();
    AnyTouch.use(Rotate);
    const el = document.createElement('div');
    const at = new AnyTouch(el);
    const gs = new GestureSimulator(el);
    at.on(ROTATE_NAME, ev => {
        mockCB(ev.type)
    });

    gs.dispatchTouchStart([{ x: 0, y: 0 }, { x: 10, y: 0 }]);
    gs.dispatchTouchMove([{ x: 0, y: 0 }, { x: 10, y: 10 }]);
    gs.dispatchTouchMove([{ x: 0, y: 0 }, { x: 10, y: 20 }]);
    gs.dispatchTouchEnd();
    await sleep();
    expect(mockCB).toHaveBeenCalledTimes(2);
    // expect(mockCB).toHaveBeenNthCalledWith(1, ROTATE_NAME);
    done();
});