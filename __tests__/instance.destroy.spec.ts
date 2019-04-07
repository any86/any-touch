import TouchSimulator from './utils/TouchSimulator';
import sleep from './utils/sleep';
import AnyTouch from '../src/main'
const el = document.createElement('div');

test('实例的destroy方法是否有效', async (done) => {
    const ts = new TouchSimulator(el, { device: 'touch' });
    const mockCallback = jest.fn();
    const at = new AnyTouch(el);
    at.on('pan', ev => {
        mockCallback();
    });
    at.destroy();
    // 模拟事件
    ts.dispatchTouchStart([{ x: 0, y: 0 }]);
    ts.dispatchTouchEnd();
    await sleep(100);
    expect(mockCallback.mock.calls.length).toBe(0);
    done();
});
