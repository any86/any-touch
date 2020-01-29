import { create } from '@testUtils';
import Rotate from '@any-touch/rotate';
import AnyTouch from '@any-touch/core';
import { sleep, rotateSimulator } from '@any-touch/simulator';
const ROTATE_NAME = 'rotate';

test(`顺时针旋转10度, 然后逆时针旋转20度`, async done => {
    const { mockCB } = create();
    AnyTouch.use(Rotate);
    const el = document.createElement('div');
    const at = new AnyTouch(el);
    at.on(ROTATE_NAME, ev => {
        mockCB(ev.type)
    });
    rotateSimulator(el, [10, -20]);
    await sleep();
    expect(mockCB).toHaveBeenCalledTimes(2);
    done();
});