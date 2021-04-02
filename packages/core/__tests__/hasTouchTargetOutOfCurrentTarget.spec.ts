import Pinch from '@any-touch/pinch';
import AnyTouch from '@any-touch/core';
import { GestureSimulator, sleep } from '@any-touch/simulator';
const PINCH_NAME = 'pinch';

test(`缩放的时候, 有一个触点不在绑定元素内, 那么不触发pinch`, async done => {
    AnyTouch.use(Pinch,{threshold:1.2});
    const el = document.createElement('div');
    const {body} = document;
    const at = new AnyTouch(el);
    const gs = new GestureSimulator(el);
    const onPinch = jest.fn().mockName(`onPinch`);
    at.on(PINCH_NAME, onPinch);
    gs.start([{ x: 0, y: 0 }]);
    gs.start([{ x:10, y: 0 }]);
    gs.move([{ x: 0, y: 0 }, { x: 20, y: 0}]);
    gs.move([{ x: 0, y: 0 }, { x: 30, y: 0,target:body}]);
    gs.move([{ x: 0, y: 0 }, { x: 40, y: 0}]);

    // gs.dispatchTouchMove([{ x: 0, y: 0 }, { x: 11, y: 0 }]);
    gs.end();
    await sleep();
    expect(onPinch).toHaveBeenCalledTimes(0);
    done();
});