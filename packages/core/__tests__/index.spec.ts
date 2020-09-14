import { create } from '@testUtils';
import Tap from '@any-touch/tap';

test('依次输入start->move->end->start-cancel', async done => {
    const { gs, at, mockCB, mock, sleep } = create();
    at.on('at', mockCB);
    gs.dispatchTouchStart();
    gs.dispatchTouchMove([{ x: 1, y: 1 }]);
    gs.dispatchTouchEnd();
    gs.dispatchTouchStart();
    gs.dispatchTouchCancel();
    await sleep(100);
    expect(mock.calls[0][0].stage).toBe('start');
    expect(mock.calls[1][0].stage).toBe('move');
    expect(mock.calls[2][0].stage).toBe('end');
    expect(mock.calls[3][0].stage).toBe('start');
    expect(mock.calls[4][0].stage).toBe('cancel');
    done();
});

test(`通过get获取tap手势实例, 并设置maxPressTime为100ms`, async done => {
    const { AnyTouch, el } = create();
    AnyTouch.use(Tap);
    const at = new AnyTouch(el);
    const tap = at.get('tap');
    expect(tap).toHaveProperty('set');
    done();
});

test('默认会触发dom事件', async done => {
    const { AnyTouch, el, GestureSimulator, mockCB, sleep } = create();
    AnyTouch.use(Tap);
    new AnyTouch(el);
    const gs = new GestureSimulator(el);
    el.addEventListener('tap', ev => {
        mockCB(ev.type);
    });
    gs.dispatchTouchStart();
    gs.dispatchTouchEnd();
    await sleep();
    expect(mockCB).toHaveBeenCalledWith('tap');
    done();
});


test(`通过set设置不触发dom事件`, async done => {
    const { AnyTouch, el, GestureSimulator, mockCB, sleep } = create();
    const at = new AnyTouch(el);
    at.set({domEvents:false});
    const gs = new GestureSimulator(el);
    el.addEventListener('tap', mockCB);
    gs.dispatchTouchStart();
    gs.dispatchTouchEnd();
    await sleep();
    expect(mockCB).not.toHaveBeenCalled();
    done();
});

test('destroy实例', () => {
    const { at, touch, sleep, mockCB } = create();
    at.on('at', mockCB);
    at.destroy();
    sleep();
    touch.dispatchTouchStart();
    expect(mockCB).toBeCalledTimes(0);
});