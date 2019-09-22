import TouchSimulator from './utils/TouchSimulator';
import sleep from './utils/sleep';
import AnyTouch from '../src/main'
const el = document.createElement('div');

const MIN_PRESS_TIME = 251;

test('press|pressup事件是否正确?', async(done) => {
    const at = new AnyTouch(el);
    const mockCallback = jest.fn();

    
    at.on('press', ({ type, timestamp }) => {
        mockCallback(type,timestamp);
    });

    at.on('pressup', ({ type, timestamp }) => {
        mockCallback(type,timestamp);
    });

    // 模拟touch触碰
    const ts = new TouchSimulator(el);
    ts.dispatchTouchStart([{ x: 0, y: 0 }]);
    ts.dispatchTouchMove([{ x: 3, y: 3 }]);
    await sleep(MIN_PRESS_TIME);
    ts.dispatchTouchEnd();
    await sleep(100);
    expect(mockCallback.mock.calls[0][0]).toBe(`press`);
    expect(mockCallback.mock.calls[1][0]).toBe(`pressup`);
    done();
});


test('移动距离过大press事件失败,流程是否正确?', async (done) => {
    const mockCallback = jest.fn();
    const at = new AnyTouch(el);
    at.on('press', ({ type }) => {
        mockCallback();
    });

    at.on('pressup', ({ type }) => {
        mockCallback();
    });
    
    // 模拟touch触碰
    const ts = new TouchSimulator(el);
    ts.dispatchTouchStart([{ x: 0, y: 0 }]);
    ts.dispatchTouchMove([{ x: 30, y: 30 }]);
    await sleep(MIN_PRESS_TIME - 100);
    ts.dispatchTouchEnd();
    // 等待MIN_PRESS_TIME秒后, 看看是否触发了事件
    await sleep(100);
    expect(mockCallback.mock.calls.length).toBe(0);
    done();
});