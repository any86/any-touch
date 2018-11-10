import TouchSimulator from './utils/TouchSimulator';
import AnyTouch from '../src/main'
document.body.innerHTML = '<div id="box">box</div>';
const el = document.getElementById('box');
const at = new AnyTouch(el);
/**
 * 模拟向下滑动
 */
const simulatorPan = () => {
    const ts = new TouchSimulator(el);
    ts.dispatchTouchStart([{ x: 30, y: 0 }]);
    ts.dispatchTouchMove([{ x: 30, y: 5 }]);
    ts.dispatchTouchMove([{ x: 30, y: 9 }]);
    ts.dispatchTouchMove([{ x: 30, y: 15 }]);
    ts.dispatchTouchMove([{ x: 30, y: 30 }]);
    ts.dispatchTouchMove([{ x: 30, y: 50 }]);
    ts.dispatchTouchMove([{ x: 30, y: 90 }]);
    ts.dispatchTouchMove([{ x: 30, y: 100 }]);
    ts.dispatchTouchEnd();
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

    at.on('panend', ({displacementY}) => {
        expect(orgX).toBe(0);
        expect(orgY).toBe(91);
        expect(displacementY).toBe(100);
        done();
    });

    // 模拟事件
    simulatorPan();
});