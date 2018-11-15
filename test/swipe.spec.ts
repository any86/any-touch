import TouchSimulator from './utils/TouchSimulator';
import swipeSimulator from './utils/Gesture/swipeSimulator';
import AnyTouch from '../src/main';
document.body.innerHTML = '<div id="box">box</div>';
const el = document.getElementById('box');
const at = new AnyTouch(el);

// ['up', 'right', 'down', 'left'].forEach(direction => {
['left'].forEach(direction => {

    test(`swipe${direction}是否触发?`, (done) => {
        at.on(`swipe`, ({ type }) => {
            expect(type).toBe(`swipe`);
            done();
        });
        // 模拟touch触碰
        swipeSimulator(el, { direction });
    });
});