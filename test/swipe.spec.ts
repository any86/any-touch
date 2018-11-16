import swipeSimulator from './utils/Gesture/swipeSimulator';
import sleep from './utils/sleep';
import AnyTouch from '../src/main';
document.body.innerHTML = '<div id="box">box</div>';
const el = document.getElementById('box');
const at = new AnyTouch(el);

['up', 'right', 'down', 'left'].forEach(direction => {
    test(`swipe${direction}是否触发?`, async (done) => {
        at.on(`swipe${direction}`, ({ type }) => {
            expect(type).toBe(`swipe${direction}`);
            done();
        });
        // 模拟touch触碰
        await sleep(500)
        swipeSimulator(el, { direction });
    });
});