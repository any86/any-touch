import TouchSimulator from './utils/TouchSimulator';
import panSimulator from './utils/Gesture/panSimulator';

import AnyTouch from '../src/main'
document.body.innerHTML = '<div id="box">box</div>';
const el = document.getElementById('box');


['up', 'right', 'down', 'left'].forEach(direction => {
    test('panup|panright|pandown|panleft是否正确?', (done) => {
        const at = new AnyTouch(el);
        const panRecognizer = at.get('pan');
        panRecognizer.set({ directions: [direction] });
        at.on(`pan${direction}`, (ev) => {
            direction = ev.direction;
        });

        at.on('panend', ev=>{
            ev.preventDefault();
            ev.stopImmediatePropagation();
            ev.stopPropagation();
        });

        // 模拟事件
        panSimulator(el, { direction });
        done();
    });
});
