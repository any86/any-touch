import { dispatchTouchStart, dispatchTouchMove, dispatchTouchEnd } from './touchEventSmulate';
import AnyTouch from '../src/main'
document.body.innerHTML = '<div id="box">box</div>';
const el = document.getElementById('box');
const at = new AnyTouch(el);
test('事件pan是否正确?', (done) => {
    let orgX = 0;
    let orgY = 0;
    at.on('panmove', ({
        deltaX,
        deltaY
    }) => {
        orgX += deltaX;
        orgY += deltaY;
    });

    at.on('panend', (e) => {
        expect(orgX).toBe(0);
        expect(orgY).toBe(100);
        done();
    });

    // 模拟touch触碰
    dispatchTouchStart(el, { x: 30, y: 0 });
    dispatchTouchMove(el, { x: 30, y: 20 });
    dispatchTouchMove(el, { x: 30, y: 50 });
    dispatchTouchMove(el, { x: 30, y: 90 });
    dispatchTouchMove(el, { x: 30, y: 120 });
    setTimeout(() => {
        dispatchTouchEnd(el);
    }, 100); 
});