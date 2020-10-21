import Pinch from '@any-touch/pinch';
import AnyTouch from '@any-touch/core';
import {sleep,createElement,GestureSimulator} from '@any-touch/simulator'
const PAN_NAME = 'pan';

test(`2触点的情况下, 使用on绑定指定target,运行时确保2个触点均落在target内部才可触发pinch`, async (done) => {
    AnyTouch.use(Pinch);
    const el = createElement();
    const parent = createElement();
    const child = createElement();
    const child2 = createElement();
    el.appendChild(parent);
    parent.appendChild(child);
    parent.appendChild(child2);
    const gs = new GestureSimulator(child);
    const at = new AnyTouch(el);
    const onPinch = jest.fn();
    const onPinchForEl = jest.fn();

    at.target(child).on('pinch', onPinch);
    at.on('pinch', onPinchForEl);
    gs.start([{ x: 1, y: 1, target: child }, { x: 12, y: 1, target: child }]);
    gs.move([{ x: 2, y: 2, target: child }, { x: 200, y: 100, target: child2 }]);
    gs.end();
    expect(onPinch).toHaveBeenCalledTimes(0);
    expect(onPinchForEl).toHaveBeenCalledTimes(1);
    await sleep();
    done();
});
