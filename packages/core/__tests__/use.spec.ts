import { create } from '@testUtils';
import Tap from '@any-touch/tap';
test(`通过实例加载/卸载插件`, async done => {
    const { AnyTouch, el, GestureSimulator, mockCB, sleep } = create();
    const at = AnyTouch(el);
    const gs = new GestureSimulator(el);
    at.use(Tap);
    at.on('tap', (ev:any) => {
        mockCB(ev.type);
    });

    gs.dispatchTouchStart();
    gs.dispatchTouchEnd();
    await sleep();
    expect(mockCB).toHaveBeenCalledWith('tap');

    // 卸载
    at.removeUse('tap');
    at.on('tap', mockCB);
    await sleep();
    expect(mockCB).toHaveBeenCalledTimes(1);
    done();
});