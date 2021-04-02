import { create } from '@testUtils';
import Tap from '@any-touch/tap';

test('依次输入start->move->end->start-cancel', async done => {
    const { gs, at, mockCB, mock, sleep } = create();
    at.on('at', mockCB);
    gs.start();
    gs.move([{ x: 1, y: 1 }]);
    gs.end();
    gs.start();
    gs.cancel();
    await sleep(100);
    expect(mock.calls[0][0].stage).toBe('start');
    expect(mock.calls[1][0].stage).toBe('move');
    expect(mock.calls[2][0].stage).toBe('end');
    expect(mock.calls[3][0].stage).toBe('start');
    expect(mock.calls[4][0].stage).toBe('cancel');
    at.destroy();
    done();
});

test(`通过get获取tap手势实例, 并设置maxPressTime为100ms`, async done => {
    const { AnyTouch, el } = create();
    AnyTouch.use(Tap);
    const at = new AnyTouch(el);
    const tap = at.get('tap');
    expect(tap).toBeInstanceOf(Tap);
    at.destroy();
    done();
});

test('默认会触发dom事件', async done => {
    const { AnyTouch, el, GestureSimulator, mockCB, sleep } = create();
    AnyTouch.use(Tap);
    const at =new AnyTouch(el);
    const gs = new GestureSimulator(el);
    el.addEventListener('tap', ev => {
        mockCB(ev.type);
    });
    gs.start();
    gs.end();
    await sleep();
    expect(mockCB).toHaveBeenCalledWith('tap');
    at.destroy();
    done();
});

test('destroy实例', () => {
    const { at, touch, sleep, mockCB } = create();
    at.on('at', mockCB);
    at.destroy();
    sleep();
    touch.start();
    expect(mockCB).toBeCalledTimes(0);
    at.destroy();
});

test('removeUse所有手势',done=>{
    const { AnyTouch, el } = create();
    const onTap = jest.fn().mockName('tap');
    const at = new AnyTouch(el);
    at.use(Tap);
    at.on('tap', onTap);
    at.removeUse();
    const tap = at.get('tap');
    expect(tap).not.toBeInstanceOf(Tap);
    expect(onTap).toBeCalledTimes(0);
    at.destroy();
    done();
});