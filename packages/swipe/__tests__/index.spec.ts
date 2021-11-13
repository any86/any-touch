import { create } from '@testUtils';
import Swipe from '@any-touch/swipe';
import Core from '@any-touch/core';
import { GestureSimulator, sleep } from '@any-touch/simulator';
const SWIPE_NAME = 'swipe';

test(`向下划`, async done => {
    const { mockCB } = create();
    Core.use(Swipe);
    const el = document.createElement('div');
    const at = new Core(el);
    const gs = new GestureSimulator(el);
    at.on(SWIPE_NAME, mockCB);

    gs.start([{ x: 0, y: 0 }]);
    await sleep(20)
    gs.move([{ x: 0, y: 10 }]);
    await sleep(20)
    gs.move([{ x: 0, y: 100 }]);
    await sleep(20)
    gs.end();
    await sleep();
    expect(mockCB).toHaveBeenCalledTimes(1);
    done();
});