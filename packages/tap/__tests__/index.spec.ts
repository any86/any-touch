import { create } from '@testUtils';
import Tap from '@any-touch/tap';
import AnyTouch from '@any-touch/core';
import {STATUS_FAILED} from '@any-touch/shared';
import {GestureSimulator, sleep} from '@any-touch/simulator';

test('加载tap, 触发一次tap', async done => {
    const { gs, el, mockCB, mockCalls, sleep, AnyTouch } = create();
    AnyTouch.use(Tap);
    const at = new AnyTouch(el);
    at.on('tap', ev => {
        mockCB(ev.type)
    });

    gs.dispatchTouchStart();
    gs.dispatchTouchEnd();
    await sleep();
    expect(mockCalls[0][0]).toBe('tap');
    done();
});


test(`双击识别器开启的情况下, 只输入1次点击, 过指定时间识别器状态为"失败"`, async done => {
    const { GestureSimulator, sleep, mockCB } = create();
    const el = document.createElement('div');
    AnyTouch.use(Tap, { name: 'doubletap', tapTimes: 2 });
    const at = new AnyTouch(el);
    const gs = new GestureSimulator(el);
    const doubletap = at.get('doubletap');
    gs.dispatchTouchStart();
    gs.dispatchTouchEnd();
    await sleep(500);
    if(void 0 !== doubletap){
        expect(doubletap.status).toBe(STATUS_FAILED);
        mockCB();
    }
    expect(mockCB).toHaveBeenCalledTimes(1);
    AnyTouch.removeUse('tap');
    done();
});


test(`当2次点击的距离超过阈值(20px), 本次点击不累计`,async done=>{
    AnyTouch.use(Tap);
    AnyTouch.use(Tap, {name:'doubletap', maxDistanceFromPrevTap:20,tapTimes:2});
    const el = document.createElement('div');
    const gs = new GestureSimulator(el);
    const at = new AnyTouch(el);
    const onTap = jest.fn().mockName('tap');
    const onDoubleTap = jest.fn().mockName('doubletap');
    at.on('tap', onTap);
    at.on('doubletap', onDoubleTap);
    gs.dispatchTouchStart();
    gs.dispatchTouchEnd();
    gs.dispatchTouchStart([{x:21,y:0}]);
    gs.dispatchTouchEnd();
    await sleep();
    expect(onTap).toHaveBeenCalledTimes(2);
    expect(onDoubleTap).not.toHaveBeenCalled();
    AnyTouch.removeUse('tap');
    AnyTouch.removeUse('doubletap');
    done();
});


test(`如果点击用时超过指定时间(250ms), 不识别成tap`, async done=>{
    const maxPressTime = 250;
    AnyTouch.use(Tap);
    const el = document.createElement('div');
    const gs = new GestureSimulator(el);
    const at = new AnyTouch(el);
    const tap = at.get('tap');
    if(tap){
        tap.set({ maxPressTime});
    }
    const onTap = jest.fn().mockName('tap');
    at.on('tap', onTap);
    gs.dispatchTouchStart();
    await sleep(maxPressTime+1);
    gs.dispatchTouchEnd();
    await sleep();
    expect(onTap).toHaveBeenCalledTimes(0);
    AnyTouch.removeUse('tap');
    done();
});