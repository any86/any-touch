import TouchSimulator from './utils/TouchSimulator';
import AnyTouch from '../src/main'

document.body.innerHTML = '<div id="box">box</div>';
const el = document.getElementById('box');
const at = new AnyTouch(el);

test('press事件是否正确?', (done) => {
    let type = '';
    at.on('press', (e) => {
        type = e.type;
        expect(type).toBe('press');
        done();
    });

    // 模拟touch触碰
    const ts = new TouchSimulator(el);
    ts.dispatchTouchStart([{ x: 0, y: 0 }]);
    setTimeout(() => {
        ts.dispatchTouchEnd();
    }, 300); 
});