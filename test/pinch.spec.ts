import {pinchIn, pinchOut} from './utils/Gesture/pinchSimulator';
import sleep from './utils/sleep';

import AnyTouch from '../src/main'
document.body.innerHTML = '<div id="box">box</div>';
const el = document.getElementById('box');
const at = new AnyTouch(el);

const simulatorPinchIn = pinchIn;
const simulatorPinchOut = pinchOut;

test('pinch缩放是否正确?', (done) => {
    let index = 0;
    let expectScales = [0.5, 0.2];
    at.on('pinch', ({ scale }) => {
        expect(scale).toBe(expectScales[index]);
        index++;
    });

    at.on('pinchin', ({ type }) => {
        expect(type).toBe('pinchin');
    });

    simulatorPinchIn(el);
    done();
});

test('pinchout是否触发?', async(done) => {
    at.on('pinchout', ({ type }) => {
        expect(type).toBe('pinchout');
        
    });
    // 等simulatorPinchIn测试完, 在开始测试
    await sleep(100);
    simulatorPinchOut(el);
    done();
});