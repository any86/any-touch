import TouchSimulator from './utils/TouchSimulator';
import AnyTouch from '../src/main'
document.body.innerHTML = '<div id="box">box</div>';
const el = document.getElementById('box');
const at = new AnyTouch(el);
/**
 * 模拟向下滑动
 */
const simulatorPan = () => {
    const ts = new TouchSimulator(el, { device: 'mouse' });
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

test(`input触发次数是否正确?`, done => {
    let index = 0;
    at.on('input', ({
        type
    }) => {
        index++;
        expect(index).toBe(9);
    });

    // 模拟事件
    simulatorPan();
    
    done();
});