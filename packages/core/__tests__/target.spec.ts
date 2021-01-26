import { create } from '@testUtils';

test('通过target指定相应事件的元素', async done => {
    const { GestureSimulator, AnyTouch, sleep } = create();
    const pEl = document.createElement('div');
    const at = new AnyTouch(pEl);
    const el = document.createElement('span');
    pEl.appendChild(el);

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