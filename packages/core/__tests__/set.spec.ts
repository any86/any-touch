import { create } from '@testUtils';
import Tap from '@any-touch/tap';

test(`通过set设置不触发dom事件`, async done => {
    const { AnyTouch, el, GestureSimulator, mockCB, sleep } = create();
    const at = new AnyTouch(el);
    at.use(Tap);
    at.set({domEvents:false});
    const gs = new GestureSimulator(el);
    el.addEventListener('tap', mockCB);
    gs.start();
    gs.end();
    await sleep();
    expect(mockCB).not.toHaveBeenCalled();
    done();
});
