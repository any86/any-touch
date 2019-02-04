delete window.ontouchstart;
import TouchSimulator from './utils/TouchSimulator';
import sleep from './utils/sleep';
import AnyTouch from '../src/main'
const el = document.createElement('div');

test('mouse下, 仅有tap识别, 事件是否触发', async (done) => {
    const at = new AnyTouch(el);
    at.on('tap', (e:any) => {
        expect(e.type).toBe('tap');
        done();
    });
    const ts = new TouchSimulator(el, {device:'mouse'});
    // 模拟touch触碰
    ts.dispatchTouchStart([{ x: 0, y: 0 }]);
    await sleep(100);
    ts.dispatchTouchEnd();
});

// test('mouse下,tap与doubletap之间的requireFailure是否生效?', async (done) => {
//     const tap2 = new AnyTouch.TapRecognizer({ name: 'doubletap', pointer: 1, taps: 2 })
//     const tap3 = new AnyTouch.TapRecognizer({ name: 'threetap', pointer: 1, taps: 3 })
//     const at = new AnyTouch(el);
//     at.add(tap2);
//     at.add(tap3);
//     const tap1 = at.get('tap');
//     tap1.requireFailure(tap2);
//     tap1.requireFailure(tap3);
//     tap2.requireFailure(tap3);

//     at.on('doubletap', (e) => {
//         expect(e.type).toBe('doubletap');
//         done();
//     });

//     const ts = new TouchSimulator(el);
//     // 模拟touch触碰
//     ts.dispatchTouchStart([{ x: 0, y: 0 }]);
//     ts.dispatchTouchEnd();

//     await sleep(10);
//     ts.dispatchTouchStart([{ x: 0, y: 0 }]);
//     ts.dispatchTouchEnd();
// });