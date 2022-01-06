import tap from '@any-touch/tap';
import doubletap from '@any-touch/doubletap';
import Core from '@any-touch/core';
import { GestureSimulator, sleep } from '@any-touch/simulator';

test('加载doubletap后,获取doubletap的实例, 实例为Tap', async (done) => {
    const el = document.createElement('div');
    const at = new Core(el);
    at.use(doubletap);
    const ref = at.get('doubletap');

    expect(ref.name).toBe('doubletap');
    expect(ref.state).toBeDefined();
    expect(ref.disabled).toBeDefined();
    expect(ref.pointLength).toBeDefined();
    expect(ref.maxDistance).toBeDefined();
    expect(ref.maxDistanceFromPrevTap).toBeDefined();
    expect(ref.maxPressTime).toBeDefined();
    expect(ref.tapTimes).toBeDefined();
    expect(ref.waitNextTapTime).toBeDefined();
    done();
});


test('加载doubletap, 触发一次tap', async (done) => {
    const el = document.createElement('div');
    const gs = new GestureSimulator(el);
    const onDoubleTap = jest.fn();
    const onTap = jest.fn();
    const at = new Core(el);
    at.use(tap);
    at.use(doubletap);
    at.on('tap', onTap);
    at.on('doubletap', onDoubleTap);

    gs.start();
    gs.end();

    gs.start();
    gs.end();

    await sleep();
    expect(onTap).toBeCalledTimes(0);
    expect(onDoubleTap).toBeCalledTimes(1);

    done();
});


test('模拟双击失败, 单击触发', async (done) => {
    const el = document.createElement('div');
    const gs = new GestureSimulator(el);
    const onDoubleTap = jest.fn();
    const onTap = jest.fn();
    const at = new Core(el);
    at.use(tap);
    at.use(doubletap);
    at.on('tap', onTap);
    at.on('doubletap', onDoubleTap);

    gs.start();
    gs.end();
    await sleep(310);
    gs.start([{ x: 100, y: 100 }]);
    gs.end();

    await sleep(310);
    expect(onTap).toBeCalledTimes(2);
    expect(onDoubleTap).toBeCalledTimes(0);
    done();
});