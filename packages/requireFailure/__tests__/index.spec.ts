import { create } from '@testUtils';
import AnyTouch from '@any-touch/core';
import Tap from '@any-touch/tap';
import requireFailure from '@any-touch/requireFailure';
import { GestureSimulator, sleep } from '@any-touch/simulator';
test('识别为双击那么单击不触发', async (done) => {
    const DOUBLE_TAP_NAME = 'doubletap';
    AnyTouch.use(Tap);
    AnyTouch.use(Tap, { name: DOUBLE_TAP_NAME, tapTimes: 2 });
    AnyTouch.use(requireFailure, 'tap', DOUBLE_TAP_NAME);
    const el = document.createElement('div');
    const gs = new GestureSimulator(el);
    const at = new AnyTouch(el);
    const onTap = jest.fn().mockName('onTap');
    const onDoubleTap = jest.fn().mockName('onDoubleTap');

    at.on('tap', onTap);
    at.on(DOUBLE_TAP_NAME, onDoubleTap);

    gs.dispatchTouchStart();
    gs.dispatchTouchEnd();
    gs.dispatchTouchStart();
    gs.dispatchTouchEnd();

    await sleep(350);
    expect(onTap).toHaveBeenCalledTimes(0);
    expect(onDoubleTap).toHaveBeenCalledTimes(1);
    done();
});


test('双击失败那么触发单击', async (done) => {
    const DOUBLE_TAP_NAME = 'doubletap';
    // AnyTouch.use(Tap);
    // AnyTouch.use(Tap, { name: DOUBLE_TAP_NAME, tapTimes: 2 });
    // AnyTouch.use(requireFailure, 'tap', DOUBLE_TAP_NAME);
    const el = document.createElement('div');
    const gs = new GestureSimulator(el);
    const at = new AnyTouch(el);
    const onTap = jest.fn().mockName('onTap');
    const onDoubleTap = jest.fn().mockName('onDoubleTap');

    at.on('tap', onTap);
    at.on(DOUBLE_TAP_NAME, onDoubleTap);

    gs.dispatchTouchStart();
    gs.dispatchTouchEnd();
    gs.dispatchTouchStart([{x:100,y:0}]);
    gs.dispatchTouchEnd();

    await sleep(350);
    expect(onTap).toHaveBeenCalledTimes(2);
    expect(onDoubleTap).toHaveBeenCalledTimes(0);
    done();
});