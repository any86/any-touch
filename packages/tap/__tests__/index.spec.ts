import { create } from '@testUtils';
import Tap from '@any-touch/tap';
import Core from '@any-touch/core';
import { STATE_FAILED } from '@any-touch/shared';
import { GestureSimulator, sleep } from '@any-touch/simulator';

test('加载tap, 触发一次tap', async done => {
    const el = document.createElement('div');
    const gs = new GestureSimulator(el);
    const onTap = jest.fn();
    const at = new Core(el);
    at.use(Tap);
    at.on('tap', onTap);

    gs.start();
    gs.end();
    await sleep();
    expect(onTap).toBeCalled()
    done();
});


test(`双击识别器开启的情况下, 只输入1次点击, 过指定时间识别器状态为"失败"`, async done => {
    const { GestureSimulator, sleep, mockCB } = create();
    const el = document.createElement('div');
    
    const at = new Core(el);
    at.use(Tap, { name: 'doubletap', tapTimes: 2 });
    const gs = new GestureSimulator(el);
    const doubletap = at.get('doubletap');
    gs.start();
    gs.end();
    await sleep(500);
    if (void 0 !== doubletap) {
        expect(doubletap.status).toBe(STATE_FAILED);
        mockCB();
    }
    expect(mockCB).toHaveBeenCalledTimes(1);
    done();
});


test(`当2次点击的距离超过阈值(20px), 本次点击不累计`, async done => {

    const el = document.createElement('div');
    const gs = new GestureSimulator(el);
    const at = new Core(el);
    at.use(Tap);
    at.use(Tap, { name: 'doubletap', maxDistanceFromPrevTap: 20, tapTimes: 2 });
    const onTap = jest.fn().mockName('tap');
    const onDoubleTap = jest.fn().mockName('doubletap');
    at.on('tap', onTap);
    at.on('doubletap', onDoubleTap);
    gs.start();
    gs.end();
    gs.start([{ x: 21, y: 0 }]);
    gs.end();
    await sleep();
    expect(onTap).toHaveBeenCalledTimes(2);
    expect(onDoubleTap).not.toHaveBeenCalled();
    done();
});


test(`如果点击用时超过指定时间(250ms), 不识别成tap`, async done => {
    const maxPressTime = 250;
    
    const el = document.createElement('div');
    const gs = new GestureSimulator(el);
    const at = new Core(el);
    at.use(Tap);
    const tap = at.get('tap');
    if (tap) {
        tap.set({ maxPressTime });
    }
    const onTap = jest.fn().mockName('tap');
    at.on('tap', onTap);
    gs.start();
    await sleep(maxPressTime + 1);
    gs.end();
    await sleep();
    expect(onTap).toHaveBeenCalledTimes(0);
    done();
});


test('测试2触点双击', async done => {
    const el = document.createElement('div');
    const gs = new GestureSimulator(el);
    
    const at = new Core(el);
    at.use(Tap, { name: 'twoFingersTap', tapTimes: 2, pointLength: 2,maxDistanceFromPrevTap:30 });
    at.on('twoFingersTap', (ev: any) => {
        expect(ev.type).toBe('twoFingersTap');
    });

    gs.start([{x:100,y:100}, {x:101,y:101}]);
    await sleep(50);
    gs.end();

    gs.start([{x:110,y:100}, {x:111,y:101}]);
    await sleep(50);
    gs.end();

    await sleep(50);
    done();

});