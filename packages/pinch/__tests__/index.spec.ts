import Pinch from '@any-touch/pinch';
import AnyTouch from '@any-touch/core';
import { GestureSimulator, sleep } from '@any-touch/simulator';
const PINCH_NAME = 'pinch';

test(`双手捏合缩小`, async done => {
    AnyTouch.use(Pinch,{threshold:1.1});
    const el = document.createElement('div');
    const at = new AnyTouch(el);
    const gs = new GestureSimulator(el);
    const onPinch = jest.fn().mockName(`onPinch`);
    at.on(PINCH_NAME, onPinch);
    gs.start([{ x: 0, y: 0 }, { x: 10, y: 0 }]);
    gs.move([{ x: 0, y: 0 }, { x: 20, y: 0 }]);
    gs.move([{ x: 0, y: 0 }, { x: 30, y: 0 }]);
    gs.end();
    await sleep();
    expect(onPinch).toHaveBeenCalledTimes(1);
    AnyTouch.removeUse();
    done();
});