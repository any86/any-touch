import pinchSimulator from './utils/Gesture/pinchSimulator';
import sleep from './utils/sleep';

import AnyTouch from '../src/main'
document.body.innerHTML = '<div id="box">box</div>';
const el = document.getElementById('box');
const at = new AnyTouch(el);


test('pinch缩放计算是否正确?', (done) => {
    let index = 0;
    let expectScales = [2, 4, 6, 3, 1, 0.5, 0.2];
    at.on('pinch', ({ type, scale }) => {
        // scale===1 不触发pinchin/out
        if (1 === scale) {
            index++;
        }
        expect(type).toBe('pinch');

    });

    at.on('pinchout', ({ scale }) => {
        expect(scale).toBe(expectScales[index]);
        index++;
    });

    at.on('pinchin', ({ scale }) => {
        expect(scale).toBe(expectScales[index]);
        index++;
    });

    at.on('pinchstart', ({ scale }) => {
        expect(scale).toBe(expectScales[0]);
    });

    at.on('pinchmove', ({ scale }) => {
        expect(scale).not.toBe(expectScales[0]);
        expect(scale).not.toBeUndefined();
    });

    at.on('pinchend', ({ scale }) => {
        expect(scale).toBeUndefined();
    });

    // 模拟缩放
    pinchSimulator(el, { scales: expectScales });
    done();
});