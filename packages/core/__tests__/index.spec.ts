import AnyTouch from '@any-touch/core';
import { GestureSimulator, sleep } from '@any-touch/simulator';
import Tap from '@any-touch/tap';

function init() {
    const el = document.createElement('div');
    const at = new AnyTouch(el);
    const gs = new GestureSimulator(el);
    const mockCB = jest.fn();
    const {mock} = mockCB;
    return {
        gs, at, el,mockCB,mock
    }
}

test('依次输入start->move->end->start-cancel', async done => {
    const {gs, at ,mockCB,mock} = init();
    at.on('at:input', ev => {
        mockCB(ev.inputType);
    });
    gs.dispatchTouchStart();
    gs.dispatchTouchMove([{x:1,y:1}]);
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

test('加载一个手势, 检查recognizers和recognizerMap', ()=>{
    const {gs,el} = init();
    AnyTouch.use(Tap);
    const at = new AnyTouch(el);
    expect(AnyTouch.recognizers.length).toBe(1);
    expect(AnyTouch.recognizerMap.tap).toBeDefined();
})