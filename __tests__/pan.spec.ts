import panSimulator from './utils/Gesture/panSimulator';
import pan2Simulator from './utils/Gesture/pan2Simulator';

import AnyTouch from '../src/main'
document.body.innerHTML = '<div id="box">box</div>';
const el = document.getElementById('box');
    test('通过多点pan, 测试Pan构造函数是否正确?', (done) => {
        const at = new AnyTouch(el);
        const pan2 = new AnyTouch.PanRecognizer({
            name: 'pan2',
            pointerLength: 2,
        })
        at.add(pan2);
        at.on(`pan2`, (ev) => {
            expect(ev.type).toBe('pan2');
        });

        at.on(`pan2end`, (ev) => {
            done();
        });
        // 模拟事件
        pan2Simulator(el, { direction:'left' });
    });


['up', 'right', 'down', 'left'].forEach(direction => {
    test('panup|panright|pandown|panleft是否正确?', (done) => {
        const at = new AnyTouch(el);
        const panRecognizer = at.get('pan');
        panRecognizer.set({ directions: [direction] });
        at.on(`pan${direction}`, (ev) => {
            expect(ev.direction).toBe(direction);
        });

        at.on(`panend`, (ev) => {
            // at.destroy();
            done();
        });
        // 模拟事件
        panSimulator(el, { direction });
    });
});
