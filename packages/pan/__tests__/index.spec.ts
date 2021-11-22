import pan from '@any-touch/pan';
import Core from '@any-touch/core';
import { sleep, GestureSimulator, panSimulator } from '@any-touch/simulator'

test(`加载2个any-touch, 触发2次panstart`, async done => {
    const el = document.createElement('div');
    const parnetEl = document.createElement('div');
    parnetEl.appendChild(el);
    const at = new Core(el);
    at.use(pan);
    const pAt = new Core(parnetEl);
    pAt.use(pan);

    const onParentPanStart = jest.fn();
    const onPanStart = jest.fn();

    at.on('panstart', onPanStart);
    pAt.on('panstart', onParentPanStart);

    const gs = new GestureSimulator(el);
    gs.start();
    await sleep(25);
    gs.move([{ x: 0, y: 11 }]);
    await sleep(25);
    gs.move([{ x: 0, y: 21 }]);
    await sleep(25);
    gs.move([{ x: 0, y: 31 }]);
    await sleep(25);
    gs.end();
    await sleep();
    expect(onPanStart).toHaveBeenCalledTimes(1);
    expect(onParentPanStart).toHaveBeenCalledTimes(1);
    // at.destroy
    done();
});

test(`左拖拽`, async done => {
    const el = document.createElement('div');
    const at = new Core(el);
    at.use(pan);
    const mockCB = jest.fn();
    at.on('pan', (e) => {
        mockCB(e.direction);
    });
    await panSimulator(el, [{ x: 100, y: 100 }], [{ x: 0, y: 11 }]);
    expect(mockCB).toHaveBeenCalledTimes(2);
    expect(mockCB).toHaveBeenNthCalledWith(1, `left`);
    expect(mockCB).toHaveBeenNthCalledWith(2, `left`);
    done();
});


test(`模拟pancancel`, async done => {
    const el = document.createElement('div');
    const gs = new GestureSimulator(el);
    const at = new Core(el);
    at.use(pan);
    const onPan = jest.fn().mockName('onPan');
    const onPanCancel = jest.fn().mockName('onPanCancel');

    at.on('pan', onPan);
    at.on('pancancel', onPanCancel);
    gs.start();
    await sleep(25);
    gs.move([{ x: 10, y: 0 }]);
    await sleep(25);
    gs.cancel();
    await sleep();
    expect(onPan).toHaveBeenCalledTimes(2);
    expect(onPanCancel).toHaveBeenCalledTimes(1);
    done();
});


test('触发一次panend', async done => {
    const el = document.createElement('div');
    const gs = new GestureSimulator(el);
    const at = new Core(el);
    at.use(pan);
    const onPanend = jest.fn().mockName('onPanend');
    at.on('panend', onPanend);
    gs.start();
    await sleep(25);
    gs.move([{ x: 10, y: 0 }]);
    await sleep(25);
    gs.end();
    await sleep();
    expect(onPanend).toHaveBeenCalledTimes(1);
    done();
});