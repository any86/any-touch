import TouchSimulator from './utils/TouchSimulator';
import AnyTouch from '../src/main';
import sleep from './utils/sleep';
const el = document.createElement('div');

test('测试pancancel', async(done) => {
    const at = new AnyTouch(el);
    at.on(`pancancel`, (ev) => {
        expect(ev.type).toBe('pancancel')
    });

    // 模拟事件
    const ts = new TouchSimulator(el);
    ts.dispatchTouchStart([{x:0,y:0}]);
    ts.dispatchTouchMove([{x:30,y:30}]);
    ts.dispatchTouchMove([{x:60,y:60}]);
    ts.dispatchTouchMove([{x:90,y:90}]);
    ts.dispatchTouchMove([{x:120,y:120}]);
    ts.dispatchTouchCancel();
    await sleep(50);
    done();
    
});
