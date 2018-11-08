import TouchSimulator from './utils/TouchSimulator';
import AnyTouch from '../src/main'
document.body.innerHTML = '<div id="box">box</div>';
const el = document.getElementById('box');
const at = new AnyTouch(el);
test('rotate是否触发?', (done) => {
    at.on('rotate', ({type}) => {
        expect(type).toBe('rotate');
        done();
    });

    // 模拟touch触碰
    let ts = new TouchSimulator();
    ts.dispatchTouchStart(el, [{ x: 50, y: 50 }, { x: 60, y: 60 }]);
    ts.dispatchTouchMove(el, [{ x: 30, y: 30 }, { x: 80, y: 80 }]);
    ts.dispatchTouchMove(el, [{ x: 0, y: 0 }, { x: 100, y: 100 }]);
    setTimeout(() => {
        ts.dispatchTouchEnd(el);
    }, 100);
});