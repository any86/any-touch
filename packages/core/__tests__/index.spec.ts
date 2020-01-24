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

    // await sleep();
    done();
});

test('isPreventDefaul=false, 那么canPreventDefault === false', () => {
    const { AnyTouch, el, touch, sleep, mockCB, mockCalls } = create();
    const at = new AnyTouch(el, { isPreventDefault: false });
    const event = new TouchEvent('touchstart', { cancelable: true });
    expect(at.canPreventDefault(event)).toBeFalsy();
});


test('通过"preventDefaultExclude"排除div元素不执行preventDefault', () => {
    const { AnyTouch, el, touch, sleep, mockCB, mockCalls } = create();
    const at = new AnyTouch(el, {
        isPreventDefault: false,
        preventDefaultExclude(ev) {
            return 'div' === (ev as any).target.tagName;
        }
    });
    expect(at.canPreventDefault({ target: { tagName: 'div' } } as any)).toBeFalsy();
});