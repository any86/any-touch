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

test('加载/卸载一个手势,', async done => {
    const { AnyTouch,el,touch,mockCB,sleep } = create();
    AnyTouch.use(Tap);
    const at = new AnyTouch(el);
    at.on('tap', ev=>{
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
    at.on('tap', ev=>{
        console.warn('tap')
        mockCallback(ev);
    });
    touch.dispatchTouchStart();
    touch.dispatchTouchEnd();
    await sleep();
    expect(mockCallback).toHaveBeenCalledTimes(0);
    done();
});

test('destroy实例', () => {
    const { at, touch, sleep, mockCB } = create();
    at.on('at:input',()=>{
        mockCB();
    });
    at.destroy();
    sleep();
    touch.dispatchTouchStart();
    expect(mockCB).toBeCalledTimes(0);
});