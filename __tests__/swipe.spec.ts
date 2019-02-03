import swipeSimulator from './utils/Gesture/swipeSimulator';
import sleep from './utils/sleep';
import AnyTouch from '../src/main';
const el = document.createElement('div');
el.setAttribute('id', 'box');
['up', 'right', 'down', 'left'].forEach(direction => {
    test(`swipe${direction}是否触发?`, async (done) => {
        const at = new AnyTouch(el);
        at.on(`swipe${direction}`, ({ type }) => {
            expect(type).toBe(`swipe${direction}`);
        });
        // 模拟touch触碰
        swipeSimulator(el, { direction });
        await sleep(100)
        at.destroy();
        done();
    });
});


test(`swipe垂直是否触发?`, async (done) => {
    const at = new AnyTouch(el);
    at.get('swipe').set({directions: ['left']});
    at.on('swipe', ev=>{
        expect(ev.type).toBe(`swipe`);
    });
    // 模拟touch触碰
        swipeSimulator(el, { direction:'left' });
        await sleep(100)
        at.destroy();
    done();
})

test(`swipe水平是否触发?`, async (done) => {
    const at = new AnyTouch(el);
    at.get('swipe').set({directions: ['up']});
    at.on('swipe', ev=>{
        expect(ev.type).toBe(`swipe`);
    });
    // 模拟touch触碰
        swipeSimulator(el, { direction:'up' });
        await sleep(100)
        at.destroy();
    done();
})