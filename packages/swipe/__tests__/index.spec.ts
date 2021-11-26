import swipe from '@any-touch/swipe';
import Core from '@any-touch/core';
import { GestureSimulator, sleep } from '@any-touch/simulator';

test(`向下划`, async done => {
    const el = document.createElement('div');
    const at = new Core(el);
    at.use(swipe);
    const mockCB =  jest.fn();
    const mockCB1 =  jest.fn();

    const gs = new GestureSimulator(el);
    at.on('swipe', mockCB);
    at.on('swipedown', mockCB1);

    gs.start([{ x: 0, y: 0 }]);
    await sleep(10)
    gs.move([{ x: 0, y: 10 }]);
    await sleep(10)
    gs.move([{ x: 0, y: 100 }]);
    gs.end();
    await sleep();
    expect(mockCB).toHaveBeenCalledTimes(1);
    expect(mockCB1).toHaveBeenCalledTimes(1);
    done();
});

