import AnyTouch from '@any-touch/core';
import { GestureSimulator, sleep } from '@any-touch/simulator';
import Tap from '@any-touch/tap';

function init() {
    const el = document.createElement('div');
    const at = new AnyTouch(el);
    const gs = new GestureSimulator(el);
    const mockCB = jest.fn();
    const {mock} = mockCB;
    const mockCalls = mock.calls;
    return {
        gs, at, el,mockCB,mock,mockCalls
    }
}


test('加载tap, 触发一次tap', async done=>{
    const {gs,el,mockCB,mockCalls} = init();
    AnyTouch.use(Tap);
    const at = new AnyTouch(el);
    at.on('tap', ev=>{
        mockCB(ev.type)
    });
    
    gs.dispatchTouchStart();
    gs.dispatchTouchEnd();
    await sleep();
    expect(mockCalls[0][0]).toBe('tap');
    done();
})