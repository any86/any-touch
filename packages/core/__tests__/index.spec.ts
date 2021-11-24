import { create } from '@testUtils';
import tap from '@any-touch/tap';

test('依次输入start->move->end->start-cancel', async done => {
    const { gs, at, mockCB, mock, sleep } = create();
    at.on('input', mockCB);
    gs.start();
    gs.move([{ x: 1, y: 1 }]);
    gs.end();
    gs.start();
    gs.cancel();
    await sleep(100);
    expect(mock.calls[0][0].phase).toBe('start');
    expect(mock.calls[1][0].phase).toBe('move');
    expect(mock.calls[2][0].phase).toBe('end');
    expect(mock.calls[3][0].phase).toBe('start');
    expect(mock.calls[4][0].phase).toBe('cancel');
    at.destroy();
    done();
});

test(`安装tap, 通过tapContext可以获取到name等字段`, async done => {
    const { Core, el } = create();
    const at = new Core(el);
    at.use(tap, { maxPressTime: 100 });
    const tapContext = at.get('tap');
    expect(tapContext).toHaveProperty('name');
    expect(tapContext).toHaveProperty('state');
    expect(tapContext).toHaveProperty('disabled');
    at.destroy();
    done();
});

test('默认会触发dom事件', async done => {
    const { Core, el, GestureSimulator, mockCB, sleep } = create();
    const at = new Core(el);
    at.use(tap);
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
    at.on('input', mockCB);
    at.destroy();
    sleep();
    touch.start();
    expect(mockCB).toBeCalledTimes(0);
    at.destroy();
});

// test('removeUse所有手势',done=>{
//     const { Core, el } = create();
//     const onTap = jest.fn().mockName('tap');
//     const at = new Core(el);
//     at.use(tap);
//     at.on('tap', onTap);
//     at.removeUse();
//     const tapContext = at.get('tap');
//     expect(tap).not.toBeInstanceOf(tap);
//     expect(onTap).toBeCalledTimes(0);
//     at.destroy();
//     done();
// });