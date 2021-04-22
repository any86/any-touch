import { create } from '@testUtils';

test('通过target指定相应事件的元素', async done => {
    const { GestureSimulator, AnyTouch, sleep } = create();
    const parentEl = document.createElement('div');
    const el = document.createElement('span');
    parentEl.appendChild(el);
    const at = new AnyTouch(parentEl);

    // 只触发span的touch事件
    const mockCallback = jest.fn();
    at.target(el).on('at', (ev) => {
        mockCallback(ev.target);
    });

    

    at.on('at', (ev) => {
        mockCallback(ev.target);
    });

    const gs = new GestureSimulator(el);
    gs.start();
    await sleep();
    expect(mockCallback).toHaveBeenNthCalledWith(1, el);
    expect(mockCallback).toHaveBeenNthCalledWith(2, el);
    done();
});