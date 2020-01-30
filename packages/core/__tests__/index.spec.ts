import { create } from '@testUtils';
import Tap from '@any-touch/tap';

test('依次输入start->move->end->start-cancel', async done => {
    const { gs, at, mockCB, mock, sleep } = create();
    at.on('at:input', ev => {
        mockCB(ev.inputType);
    });
    gs.dispatchTouchStart();
    gs.dispatchTouchMove([{ x: 1, y: 1 }]);
    gs.dispatchTouchEnd();
    gs.dispatchTouchStart();
    gs.dispatchTouchCancel();
    await sleep(100);
    expect(mock.calls[0][0]).toBe('start');
    expect(mock.calls[1][0]).toBe('move');
    expect(mock.calls[2][0]).toBe('end');
    expect(mock.calls[3][0]).toBe('start');
    expect(mock.calls[4][0]).toBe('cancel');
    done();
});

test('通过target指定相应事件的元素', async done => {
    const { GestureSimulator, AnyTouch, sleep } = create();
    const pEl = document.createElement('div');
    const at = new AnyTouch(pEl);
    const el = document.createElement('span');
    pEl.appendChild(el);

    // 只触发span的touch事件
    const mockCallback = jest.fn();
    at.target(el).on('at:input', ev => {
        mockCallback(ev.target);
    });

    at.on('at:input', ev => {
        mockCallback(ev.target);
    });

    const gs = new GestureSimulator(el);
    gs.dispatchTouchStart();
    await sleep();
    expect(mockCallback).toHaveBeenNthCalledWith(1, el);
    expect(mockCallback).toHaveBeenNthCalledWith(2, el);
    done();
});


test('加载/卸载一个手势,', async done => {
    const { AnyTouch, el, touch, mockCB, sleep } = create();
    AnyTouch.use(Tap);
    const at = new AnyTouch(el);
    at.on('tap', ev => {
        mockCB(ev);
    });
    touch.dispatchTouchStart();
    touch.dispatchTouchEnd();
    await sleep();

    expect(AnyTouch.recognizers.length).toBe(1);
    expect(AnyTouch.recognizerMap.tap).toBeDefined();
    expect(mockCB).toHaveBeenCalledTimes(1);
    await sleep();

    AnyTouch.removeUse('tap');
    const mockCallback = jest.fn();
    at.on('tap', ev => {
        console.warn('tap')
        mockCallback(ev);
    });
    touch.dispatchTouchStart();
    touch.dispatchTouchEnd();
    await sleep();
    expect(mockCallback).toHaveBeenCalledTimes(0);
    done();
});

test(`通过实例加载/卸载插件`, async done => {
    const { AnyTouch, el, GestureSimulator, mockCB, sleep } = create();
    const at = new AnyTouch(el);
    const gs = new GestureSimulator(el);
    at.use(Tap);
    at.on('tap', ev => {
        mockCB(ev.type);
    });

    gs.dispatchTouchStart();
    gs.dispatchTouchEnd();
    await sleep();
    expect(mockCB).toHaveBeenCalledWith('tap');

    // 卸载
    at.removeUse('tap');
    at.on('tap', ev => {
        mockCB();
    });
    await sleep();
    expect(mockCB).toHaveBeenCalledTimes(1);
    done();
});


test(`通过get获取tap手势实例, 并设置maxPressTime为100ms`, async done => {
    const { AnyTouch, el } = create();
    AnyTouch.use(Tap);
    const at = new AnyTouch(el);
    const tap = at.get('tap');
    expect(tap).toBeInstanceOf(Tap);
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
    at.set({withDomEvents:false});
    const gs = new GestureSimulator(el);
    el.addEventListener('tap', ev => {
        mockCB();
    });
    gs.dispatchTouchStart();
    gs.dispatchTouchEnd();
    await sleep();
    expect(mockCB).not.toHaveBeenCalled();
    done();
});

test('destroy实例', () => {
    const { at, touch, sleep, mockCB } = create();
    at.on('at:input', () => {
        mockCB();
    });
    at.destroy();
    sleep();
    touch.dispatchTouchStart();
    expect(mockCB).toBeCalledTimes(0);
});