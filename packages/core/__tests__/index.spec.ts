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

test('加载一个手势, 检查recognizers和recognizerMap', () => {
    const {AnyTouch } = create();
    AnyTouch.use(Tap);
    expect(AnyTouch.recognizers.length).toBe(1);
    expect(AnyTouch.recognizerMap.tap).toBeDefined();
});


test('通过isPreventDefault禁止默认事件触发', async done=>{
    const {AnyTouch, el,gs, sleep} = create();
    const at = new AnyTouch(el, {isPreventDefault:false});
    el.addEventListener('click',ev=>{
        console.warn('click')
    });
    gs.dispatchTouchStart();
    gs.dispatchTouchEnd();
    await sleep();
    done();
});