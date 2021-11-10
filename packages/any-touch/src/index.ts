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
import Swipe from '@any-touch/swipe';
import Press from '@any-touch/press';
import Pinch from '@any-touch/pinch';
import Rotate from '@any-touch/rotate';

import {
    STATUS_POSSIBLE,
    STATUS_START,
    STATUS_MOVE,
    STATUS_END,
    STATUS_CANCELLED,
    STATUS_FAILED,
    STATUS_RECOGNIZED,
} from '@any-touch/shared';

// 类型, 为了兼容
import { Options } from '@any-touch/core';
import { Plugin } from '@any-touch/shared';

export default class extends Core {
    static version = '__VERSION__';
    // 状态码
    static STATUS_POSSIBLE = STATUS_POSSIBLE;
    static STATUS_START = STATUS_START;
    static STATUS_MOVE = STATUS_MOVE;
    static STATUS_END = STATUS_END;
    static STATUS_CANCELLED = STATUS_CANCELLED;
    static STATUS_FAILED = STATUS_FAILED;
    static STATUS_RECOGNIZED = STATUS_RECOGNIZED;


    constructor(el?: HTMLElement, options?: Options) {
        super(el, options);
        pan(this);
        tap(this);
    }
}