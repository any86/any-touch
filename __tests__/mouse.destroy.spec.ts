delete window.ontouchstart;
import TouchSimulator from './utils/TouchSimulator';
import sleep from './utils/sleep';
import AnyTouch from '../src/main'

test('mouse设备下, 实例的destroy方法是否有效', async (done) => {
    const el = document.createElement('div');
    const mockCallback = jest.fn();
    const at = new AnyTouch(el);
    at.on('tap', ev => {
        mockCallback();
    });
    at.destroy();
    // 模拟事件
    const ts = new TouchSimulator(el, {device:'mouse'});
    ts.dispatchTouchStart([{ x: 0, y: 0 }]);
    ts.dispatchTouchEnd();
    await sleep(50);
    expect(mockCallback.mock.calls.length).toBe(0);
    done();
});