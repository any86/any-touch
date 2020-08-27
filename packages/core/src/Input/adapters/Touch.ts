import type { BaseInput, InputType, Input } from '@any-touch/shared';
import InputFactory from '../index';
/**
 * 格式化Touch事件对象
 */
export default function (el?: HTMLElement) {
    const transform = InputFactory();

    return function (event: TouchEvent) {
        // tip: wx下没有targetTouches
        const targets: EventTarget[] = [];
        const points: { clientX: number, clientY: number, target: EventTarget }[] = [];
        Array.from(event.touches).forEach(({ clientX, clientY, target }) => {
            // 确保触点都在同一个元素上
            if (el?.contains(target as HTMLElement)) {
                targets.push(target);
                points.push({ clientX, clientY, target });
            }
        });
        const changedPoints = Array.from(event.changedTouches).map(({ clientX, clientY, target }) => ({ clientX, clientY, target }));
        return transform({
            inputType: <InputType>event.type.replace('touch', ''),
            changedPoints,
            points,
            nativeEvent: event,
            target: event.target,
            targets
        });
    }
}

