import swipeSimulator from './utils/Gesture/swipeSimulator';
import sleep from './utils/sleep';
import AnyTouch from '../src/main';
const el = document.createElement('div');

['up', 'right', 'down', 'left'].forEach(direction => {
    test(`swipe${direction}是否触发?`, async (done) => {
        const at = new AnyTouch(el);
        const mockCallback = jest.fn();
        at.on(`swipe${direction}`, ({ type }) => {
            mockCallback(type);
        });
        // 模拟touch触碰
        swipeSimulator(el, { direction });
        await sleep(100)
        at.destroy();
        await sleep(100)
        expect(mockCallback.mock.calls[0][0]).toBe(`swipe${direction}`);
        done();
    });
});


test(`swipe垂直是否触发?`, async (done) => {
    const at = new AnyTouch(el);
    const mockCallback = jest.fn();
    const swipe = at.get('swipe')
    if (undefined === swipe) return;
    swipe.set({ directions: ['left'] });
    at.on('swipe', ev => {
        mockCallback(ev.type, ev.direction);
    });
    // 模拟touch触碰
    swipeSimulator(el, { direction: 'left' });
    await sleep(100)
    at.destroy();
    expect(mockCallback.mock.calls[0][0]).toBe('swipe');
    expect(mockCallback.mock.calls[0][1]).toBe('left');
    done();
})

test(`swipe水平是否触发?`, async (done) => {
    const at = new AnyTouch(el);
    const mockCallback = jest.fn();
    const swipe = at.get('swipe');
    if (undefined === swipe) return;
    swipe.set({ directions: ['up'] });
    at.on('swipe', ev => {
        mockCallback(ev.type, ev.direction);
    });
    // 模拟touch触碰
    swipeSimulator(el, { direction: 'up' });
    await sleep(100)
    at.destroy();
    expect(mockCallback.mock.calls[0][0]).toBe('swipe');
    expect(mockCallback.mock.calls[0][1]).toBe('up');
    done();
})