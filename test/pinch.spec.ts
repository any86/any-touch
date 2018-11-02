import { dispatchTouchStart, dispatchTouchMove, dispatchTouchEnd } from './touchEventSimulator';
import AnyTouch from '../src/main'
document.body.innerHTML = '<div id="box">box</div>';
const el = document.getElementById('box');
const at = new AnyTouch(el);
test('事件pinch是否正确?', (done) => {
    let isInvoke = false;
    at.on('pinch', () => {
        isInvoke = true;
        expect(isInvoke).toBeTruthy();
        done();
    });

    // 模拟touch触碰
    dispatchTouchStart(el, [{ x: 50, y: 50 }, { x: 60, y: 60 }]);
    dispatchTouchMove(el, [{ x: 30, y: 30 }, { x: 80, y: 80 }]);
    dispatchTouchMove(el, [{ x: 0, y: 0 }, { x: 100, y: 100 }]);
    setTimeout(() => {
        dispatchTouchEnd(el);
    }, 100);
});