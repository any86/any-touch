import TouchSimulator from './utils/TouchSimulator';
import sleep from './utils/sleep';
import AnyTouch from '../src/main'
document.body.innerHTML = '<div id="box">box</div>';
const el = document.getElementById('box');

test('仅有tap识别, 事件是否触发', async (done) => {
    const at = new AnyTouch(el);
    let type = '';
    at.on('tap', (e) => {
        type = e.type;
        expect(type).toBe('tap');
        done();
    });
    const ts = new TouchSimulator();
    // 模拟touch触碰
    ts.dispatchTouchStart(el, [{ x: 0, y: 0 }]);
    await sleep(100);
    ts.dispatchTouchEnd(el);
});


// test('tap之间的requireFailure是否生效?', async (done) => {
//     const tap2 = new AnyTouch.TapRecognizer({ name: 'doubletap', pointer: 1, taps: 2 })
//     const tap3 = new AnyTouch.TapRecognizer({ name: 'threetap', pointer: 1, taps: 3 })
//     const anyTouch = new AnyTouch(document.getElementById('box'));
//     anyTouch.add(tap2);
//     anyTouch.add(tap3);
//     const tap1 = anyTouch.get('tap');
//     tap1.requireFailure(tap2);
//     tap1.requireFailure(tap3);
//     tap2.requireFailure(tap3);
//     const at = new AnyTouch(el);

//     at.on('doubletap', (e) => {
//         expect(e.type).toBe('doubletap');
//         done();
//     });

//     let lastTime:number = Date.now();
//     el.addEventListener('touchstart', e=>{
//         console.log(e.type,  Date.now() - lastTime);
//         lastTime = Date.now();
//     })

//     el.addEventListener('touchend', e=>{
//         console.log(e.type,  Date.now() - lastTime);
//         lastTime = Date.now();
//     })

//     // 模拟touch触碰
//     dispatchTouchStart(el, [{ x: 0, y: 0 }]);
//     await sleep(50);
//     dispatchTouchEnd(el);

//     await sleep(10);
//     dispatchTouchStart(el, [{ x: 0, y: 0 }]);
//     await sleep(50);
//     dispatchTouchEnd(el);
// });