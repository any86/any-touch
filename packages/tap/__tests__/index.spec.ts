import {create} from '@testUtils';
import Tap from '@any-touch/tap';



test('加载tap, 触发一次tap', async done=>{
    const {gs,el,mockCB,mockCalls,sleep,AnyTouch} = create();
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