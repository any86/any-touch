import TouchSimulator from './utils/TouchSimulator';
import panSimulator from './utils/Gesture/panSimulator';

import AnyTouch from '../src/main'
document.body.innerHTML = '<div id="box">box</div>';
const el = document.getElementById('box');
let at = new AnyTouch(el);


// ['panstart', 'panmove', 'panend', 'pan', 'pandown'].forEach(name => {
//     test(`${name}是否触发?`, done => {
//         at.on(name, ({
//             type
//         }) => {
//             expect(type).toBe(name);
//         });

//         // 模拟事件
//         panSimulator(el);
//         done();
//     });
// });

// test('pan位移计算是否正确?', (done) => {
//     at.destroy();
//     at = new AnyTouch(el);
//     let orgX = 0;
//     let orgY = 0;

//     at.on('panstart', ({
//         deltaX,
//         deltaY
//     }) => {
//         orgX += deltaX;
//         orgY += deltaY;
//     });

//     at.on('panmove', ({
//         deltaX,
//         deltaY
//     }) => {
//         orgX += deltaX;
//         orgY += deltaY;
//     });

//     at.on('panend', ({ displacementY }) => {
//         expect(orgX).toBe(0);
//         expect(orgY).toBe(91);
//         expect(displacementY).toBe(100);
//     });

//     // 模拟事件
//     panSimulator(el, { destX: 100, destY: 100, startX: 0, startY: 0 });
//     done();
// });


['up', 'right', 'down', 'left'].forEach(direction => {
    test('panup|panright|pandown|panleft是否正确?', (done) => {
        at.destroy();
        at = new AnyTouch(el);
        const panRecognizer = at.get('pan');
        panRecognizer.set({ directions: [direction] });
        let dir = '';
        at.on(`pan${direction}`, (ev) => {
            dir = ev.direction;
        });

        at.on('panend', ev=>{
            expect(dir).toBe(ev.direction);
        });

        // 模拟事件
        panSimulator(el, { direction });
        done();
    });
});
