import { create } from '@testUtils';
import Tap from '@any-touch/tap';
import AnyTouch from '@any-touch/core';
import {STATUS_FAILED} from '@any-touch/shared';

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
    done();
});