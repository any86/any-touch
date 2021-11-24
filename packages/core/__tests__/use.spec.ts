import { create } from '@testUtils';
import tap from '@any-touch/tap';
test(`通过实例加载插件`, async done => {
    const { Core, el, GestureSimulator, mockCB, sleep } = create();
    const at = new Core(el);
    const gs = new GestureSimulator(el);
    at.use(tap);
    at.on('tap', (ev) => {
        mockCB(ev.type);
    });
    gs.start();
    gs.end();
    await sleep();
    expect(mockCB).toHaveBeenCalledWith('tap');
    done();
});