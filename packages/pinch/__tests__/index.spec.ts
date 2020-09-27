import Pinch from '@any-touch/pinch';
import AnyTouch from '@any-touch/core';
import { GestureSimulator, sleep } from '@any-touch/simulator';
const PINCH_NAME = 'pinch';

test(`双手捏合缩小`, async done => {
    const el = document.createElement('div');
    const at = AnyTouch(el);
    at.use(Pinch,{threshold:1.1});

    const gs = new GestureSimulator(el);
    const onPinch = jest.fn().mockName(`onPinch`);
    at.on(PINCH_NAME, onPinch);
    gs.dispatchTouchStart([{ x: 0, y: 0 }, { x: 10, y: 0 }]);
    gs.dispatchTouchMove([{ x: 0, y: 0 }, { x: 20, y: 0 }]);
    gs.dispatchTouchMove([{ x: 0, y: 0 }, { x: 30, y: 0 }]);
    gs.dispatchTouchEnd();
    await sleep();
    expect(onPinch).toHaveBeenCalledTimes(1);
    at.removeUse();
    done();
});