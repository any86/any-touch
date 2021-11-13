import pinch from '@any-touch/pinch';
import AnyTouch from 'any-touch';
import { GestureSimulator, sleep } from '@any-touch/simulator';

test(`双手捏合缩小`, async done => {
    const el = document.createElement('div');
    const at = new AnyTouch(el);
    const gs = new GestureSimulator(el);
    const onPinch = jest.fn().mockName(`onPinch`);
    at.on(`pinch`, onPinch);
    gs.start([{ x: 0, y: 0 }, { x: 10, y: 0 }]);
    gs.move([{ x: 0, y: 0 }, { x: 20, y: 0 }]);
    gs.move([{ x: 0, y: 0 }, { x: 30, y: 0 }]);
    gs.end();
    await sleep();
    expect(onPinch).toHaveBeenCalledTimes(2);
    done();
});