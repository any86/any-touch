import AnyTouch from '@any-touch/core';
import { sleep, GestureSimulator } from '@any-touch/simulator'
test('元素和浏览器左上角偏移100px,获取触点在元素内的偏移', async done => {
    const el = document.createElement('div');
    const gs = new GestureSimulator(el);
    // !!! getBoundingClientRect在jsdom下不好使, mock下
    el.getBoundingClientRect = () => ({
        left: 120,
        top: 120,
    } as any);

    const at = new AnyTouch(el);
    const callback = jest.fn();
    at.on('at:start', (ev) => {
        const data = ev.getOffset(el);
        callback(data);
    });
    gs.start([{ x: 200, y: 200 }]);
    gs.end();
    await sleep(100);
    expect(callback).toHaveBeenCalledWith({x:80,y:80});
    done();
});