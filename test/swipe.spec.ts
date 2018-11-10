import TouchSimulator from './utils/TouchSimulator';import AnyTouch from '../src/main'
document.body.innerHTML = '<div id="box">box</div>';
const el = document.getElementById('box');
const at = new AnyTouch(el);
test('swipedown是否触发?', (done) => {
    at.on('swipedown', ({type}) => {
        expect(type).toBe('swipedown');
        done();
    });

    at.on('swipe', ({type}) => {
        expect(type).toBe('swipe');
        done();
    });

    const ts = new TouchSimulator(el);
    // 模拟touch触碰
    ts.dispatchTouchStart([{ x: 30, y: 0 }]);
    ts.dispatchTouchMove([{ x: 30, y: 100 }]);
    ts.dispatchTouchMove([{ x: 30, y: 200 }]);
    ts.dispatchTouchMove([{ x: 30, y: 300 }]);
    setTimeout(() => {
        ts.dispatchTouchEnd();
    }, 30);
});