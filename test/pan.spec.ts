import TouchSimulator from './utils/TouchSimulator';
import AnyTouch from '../src/main'
document.body.innerHTML = '<div id="box">box</div>';
const el = document.getElementById('box');
const at = new AnyTouch(el);
/**
 * 模拟向下滑动
 */
const simulatorPan = () => {
    const ts = new TouchSimulator();
    ts.dispatchTouchStart(el, [{ x: 30, y: 0 }]);
    ts.dispatchTouchMove(el, [{ x: 30, y: 10 }]);
    ts.dispatchTouchMove(el, [{ x: 30, y: 20 }]);
    ts.dispatchTouchMove(el, [{ x: 30, y: 50 }]);
    ts.dispatchTouchMove(el, [{ x: 30, y: 90 }]);
    ts.dispatchTouchMove(el, [{ x: 30, y: 110 }]);
    setTimeout(() => {
        ts.dispatchTouchEnd(el);
    }, 100);
};

['panstart', 'panmove', 'panend', 'pan', 'pandown'].forEach(name => {
    test(`${name}是否触发?`, done => {
        at.on(name, ({
            type
        }) => {
            expect(type).toBe(name);
            done();
        });

        // 模拟事件
        simulatorPan();
    });
});


test('pan位移计算是否正确?', (done) => {
    let orgX = 0;
    let orgY = 0;

    at.on('panstart', ({
        deltaX,
        deltaY
    }) => {
        orgX += deltaX;
        orgY += deltaY;
    });

    at.on('panmove', ({
        deltaX,
        deltaY
    }) => {
        orgX += deltaX;
        orgY += deltaY;
    });

    at.on('panend', () => {
        expect(orgX).toBe(0);
        expect(orgY).toBe(110);
        done();
    });

    // 模拟事件
    simulatorPan();
});