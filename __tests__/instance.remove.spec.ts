import panSimulator from './utils/Gesture/panSimulator';
import sleep from './utils/sleep';
import AnyTouch from '../src/main'
const el = document.createElement('div');

test('实例的remove方法是否有效', async (done) => {
    const mockCallback = jest.fn();
    const at = new AnyTouch(el);
    at.remove('pan');
    at.on('pan', ev => {
        mockCallback();
    });
    // 模拟事件
    panSimulator(el, { direction:'left' });
    expect(mockCallback.mock.calls.length).toBe(0);
    done();
});
