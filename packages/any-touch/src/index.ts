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

import {
    STATE_POSSIBLE,
    STATE_START,
    STATE_MOVE,
    STATE_END,
    STATE_CANCELLED,
    STATE_FAILED,
    STATE_RECOGNIZED,
} from '@any-touch/shared';

// 类型, 为了兼容
import { Options } from '@any-touch/core';

export default class extends Core {
    static version = '__VERSION__';
    // 状态码
    static STATUS_POSSIBLE = STATE_POSSIBLE;
    static STATUS_START = STATE_START;
    static STATUS_MOVE = STATE_MOVE;
    static STATUS_END = STATE_END;
    static STATUS_CANCELLED = STATE_CANCELLED;
    static STATUS_FAILED = STATE_FAILED;
    static STATUS_RECOGNIZED = STATE_RECOGNIZED;

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
