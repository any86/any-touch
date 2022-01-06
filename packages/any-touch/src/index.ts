/*
 * ==================== 支持的手势 ====================
 * rotate 旋转
 * pinch 捏合,
 * tap 点击
 * press 按压
 * pan 拖拽
 * swipe 快划
 */

import Core from '@any-touch/core';
import tap from '@any-touch/tap';
import pan from '@any-touch/pan';
import swipe from '@any-touch/swipe';
import press from '@any-touch/press';
import pinch from '@any-touch/pinch';
import rotate from '@any-touch/rotate';
import doubletap from '@any-touch/doubletap';


import {
    STATE
} from '@any-touch/shared';

// 类型, 为了兼容
import { Options } from '@any-touch/core';

export default class extends Core {
    static version = '__VERSION__';
    // 状态码
    static STATE_POSSIBLE = STATE.POSSIBLE;
    static STATE_START = STATE.START;
    static STATE_MOVE = STATE.MOVE;
    static STATE_END = STATE.END;
    static STATE_CANCELLED = STATE.CANCELLED;
    static STATE_FAILED = STATE.FAILED;
    static STATE_RECOGNIZED = STATE.RECOGNIZED;
    static tap = tap;
    static pan = pan;
    static swipe = swipe;
    static press = press;
    static rotate = rotate;
    static pinch = pinch;
    static doubletap = doubletap;

    constructor(el?: HTMLElement, options?: Options) {
        super(el, options);
        this.use(tap);
        this.use(pan);
        this.use(swipe);
        this.use(press);
        this.use(pinch);
        this.use(rotate);
    }
}
