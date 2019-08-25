import TouchSimulator from './utils/TouchSimulator';
import sleep from './utils/sleep';
import AnyTouch from '../src/main'

test('syncToAttr是否正确?', async (done) => {
    const el = document.createElement('div');
    const at = new AnyTouch(el, { syncToAttr:true });
    const ts = new TouchSimulator(el);
    // 模拟touch触碰
    ts.dispatchTouchStart([{ x: 0, y: 0 }]);
    await sleep(100);
    ts.dispatchTouchEnd();
    await sleep(100);
    expect(el.getAttribute('at-gesture')).toBe('tap');
    done();
});
