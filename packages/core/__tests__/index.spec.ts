import AnyTouch from '@any-touch/core';
import { GestureSimulator, sleep } from '../../simulator/src';


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
    done();
});