import panSimulator from './utils/Gesture/panSimulator';
import sleep from './utils/sleep';
import AnyTouch from '../src/main'
document.body.innerHTML = '<div id="box">box</div>';
const el = document.getElementById('box');

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
