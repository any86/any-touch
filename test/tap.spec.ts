import { dispatchTouchStart, dispatchTouchMove, dispatchTouchEnd } from './touchEventSimulator';
import AnyTouch from '../src/main'

document.body.innerHTML = '<div id="box">box</div>';
const el = document.getElementById('box');
const at = new AnyTouch(el);

test('tap事件是否正确?', (done) => {
    let type = '';
    at.on('tap', (e) => {
        type = e.type;
        expect(type).toBe('tap');
        done();
    });

    // 模拟touch触碰
    dispatchTouchStart(el, [{ x: 0, y: 0 }]);
    setTimeout(() => {
        dispatchTouchEnd(el);
    }, 100); 
});