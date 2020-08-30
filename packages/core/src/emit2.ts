import AnyTouch from './index';
import dispatchDomEvent from './dispatchDomEvent'
import { AnyTouchEvent } from '@any-touch/shared';
const AT_AFTER = 'at:after';
/**
 * 触发自定义和dom事件
 * @param at AnyTouch实例
 * @param payload 数据
 */
export default function emit2(at: AnyTouch, payload: AnyTouchEvent) {
    const { type, target } = payload;
    at.emit(type, payload);
    at.emit(AT_AFTER, payload);
    // 触发DOM事件
    if (!!at.options.domEvents
        && void 0 !== at.el
        && null !== target
    ) {
        // vue会把绑定元素的所有子元素都进行事件绑定
        // 所以此处的target会自动冒泡到目标元素
        dispatchDomEvent(target, payload, at.options.domEvents);
        dispatchDomEvent(target, { ...payload, _type: payload.type, type: AT_AFTER }, at.options.domEvents);
    }
};