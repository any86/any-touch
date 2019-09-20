import TouchSimulator from './utils/TouchSimulator';
import sleep from './utils/sleep';
import AnyTouch from '../src/main'

test('用catchEvent直接传入实践对象', async (done) => {
    const el = document.createElement('div');
    const at = new AnyTouch();

    el.addEventListener('touchstart', ev=>{
        at.catchEvent(ev);
    });

    el.addEventListener('touchmove', ev=>{
        at.catchEvent(ev);
    });

    el.addEventListener('touchend', ev=>{
        at.catchEvent(ev);
    });    

    at.on('tap', (e: any) => {
        expect(e.type).toBe('tap');
    });
    const ts = new TouchSimulator(el);
    // 模拟touch触碰
    ts.dispatchTouchStart([{ x: 0, y: 0 }]);
    await sleep(100);
    ts.dispatchTouchEnd();
    await sleep(100);
    done();
});