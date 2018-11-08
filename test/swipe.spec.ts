import { dispatchTouchStart, dispatchTouchMove, dispatchTouchEnd } from './utils/touchEventSimulator';
import AnyTouch from '../src/main'
document.body.innerHTML = '<div id="box">box</div>';
const el = document.getElementById('box');
const at = new AnyTouch(el);
test('事件swipe是否正确?', (done) => {
    let isInvoke = false;
    at.on('swipe', () => {
        isInvoke = true;
        expect(isInvoke).toBeTruthy();
        done();
    });

    // 模拟touch触碰
    dispatchTouchStart(el, [{ x: 30, y: 0 }]);
    dispatchTouchMove(el, [{ x: 30, y: 100 }]);
    dispatchTouchMove(el, [{ x: 30, y: 200 }]);
    dispatchTouchMove(el, [{ x: 30, y: 300 }]);
    setTimeout(() => {
        dispatchTouchEnd(el);
    }, 100);
});