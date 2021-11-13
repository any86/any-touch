import Core from './index';
import dispatchDomEvent from './dispatchDomEvent'
import { AnyTouchEvent } from '@any-touch/shared';
import { Options } from './index';
/**
 * 触发自定义和dom事件
 * @param at AnyTouch实例
 * @param payload 数据
 */
export default function (at: Core, payload: AnyTouchEvent, atOptions: Options) {
    const { type, target } = payload;
    at.emit(type, payload);
    // 触发DOM事件
    if (!!atOptions.domEvents
        && void 0 !== at.el
        && null !== target
    ) {
        // 所以此处的target会自动冒泡到目标元素
        dispatchDomEvent(target, payload, atOptions.domEvents);
    }
};