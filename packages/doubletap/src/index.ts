import Core from '@any-touch/core';
import tap from '@any-touch/tap';
import { STATE } from '@any-touch/shared';
import { TapContext } from '@any-touch/tap';
import type {
    AnyTouchEvent,
} from '@any-touch/shared';
const { setTimeout } = window;
/**
 * 扩展插件映射
 */
declare module '@any-touch/core' {
    interface PluginContextMap {
        doubletap: TapContext;
    }

    export interface EventMap {
        doubletap: AnyTouchEvent;
    }
}

/**
 * "拖拽"识别器
 * @param at AnyTouch实例
 * @param options 识别器选项
 * @returns  识别器实例
 */
export default function (at: Core) {
    at.use(tap, { name: 'doubletap', tapTimes: 2 });
    const doubleTapContext = at.get('doubletap')
    let timeID: number;
    at.beforeEach((type, next) => {
        if ('tap' === type) {
            clearTimeout(timeID);
            timeID = setTimeout(() => {
                if ([STATE.POSSIBLE, STATE.FAILED].includes(doubleTapContext.state)) {
                    next();
                }
            }, 300);
        } else {
            next();
        }
    });
    return doubleTapContext;
}