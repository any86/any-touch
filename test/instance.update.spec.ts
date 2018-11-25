import panSimulator from './utils/Gesture/panSimulator';
import sleep from './utils/sleep';
import AnyTouch from '../src/main'
document.body.innerHTML = '<div id="box">box</div>';
const el = document.getElementById('box');

test('实例上的update是否生效', async (done) => {
    const mockCallback = jest.fn();
    const at = new AnyTouch(el);
    at.set({ touchAction: 'auto' });
    expect(el.style.touchAction).toBe('auto');
    done();
});
