import AnyTouch from './index';
import dispatchDomEvent from './dispatchDomEvent'
import { Input } from '@any-touch/shared';
/**
 * 触发自定义和dom事件
 * @param at AnyTouch实例
 * @param payload 数据
 */
export default function emit2(at: AnyTouch, payload: Record<string, any> & Input) {
    const { type, target, targets } = payload;
    at.emit(type, payload, data => {
        if (void 0 !== data?.target) {
            // 可选链在3.7.5下推断有点问题, 下面直接用data.target会提示data.target可能为undefined
            const currentTarget = data.target;
            // 没有绑定currentTarget
            // 也就是没使用target方法或on指定targets
            // 如果指定了, 
            // 那么检查当前触发事件的元素是否是其子元素
            return targets.every((target) => currentTarget.contains(target as HTMLElement));
        }
        return true;
    });
    const AT_AFTER = 'at:after';
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