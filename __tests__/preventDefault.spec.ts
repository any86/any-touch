import TouchSimulator from './utils/TouchSimulator';
import sleep from './utils/sleep';
import AnyTouch from '../src/main'
const el = document.createElement('div');

test('仅有tap识别, 事件是否触发', async (done) => {
    const at = new AnyTouch(el);
    at.on('tap', (e:any) => {
        expect(e.type).toBe('tap');
        e.preventDefault();
    });
    
    el.addEventListener('click', (ev:any)=>{
        expect(ev.type).toBe('click');
    });

    const ts = new TouchSimulator(el);
    // 模拟touch触碰
    ts.dispatchTouchStart([{ x: 0, y: 0 }]);
    await sleep(100);
    ts.dispatchTouchEnd();
    await sleep(100);
    done();
});