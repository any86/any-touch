import pinchSimulator from './utils/Gesture/pinchSimulator';
import sleep from './utils/sleep';

import AnyTouch from '../src/main'
document.body.innerHTML = '<div id="box">box</div>';
const el = document.getElementById('box');
const at = new AnyTouch(el);

// const simulatorPinchIn = pinchIn;
// const simulatorPinchOut = pinchOut;

test('pinch缩放是否正确?', (done) => {
    let index = 0;
    let expectScales = [1,0.5, 0.2];
    at.on('pinch', ({ scale }) => {
        expect(scale).toBe(expectScales[index]);
        index++;
    });

    at.on('pinchin', ({ type }) => {
        expect(type).toBe('pinchin');
    });
    // 模拟缩放
    pinchSimulator(el, { scales: expectScales });
    done();
});

test('pinchout是否触发?', async (done) => {
    at.on('pinchout', ({ type }) => {
        expect(type).toBe('pinchout');
    });
    pinchSimulator(el, { scales: [1, 2, 3, 4] });
    done();
});

['start', 'move', 'end'].forEach(status=>{
    test(`pinch${status}是否触发?`, async (done) => {
        at.on(`pinch${status}`, ({ type }) => {
            expect(type).toBe(`pinch${status}`);
        });
        pinchSimulator(el, { scales: [1, 2, 3, 4] });
        done();
    });
});