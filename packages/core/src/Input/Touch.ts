import type {stage } from '@any-touch/shared';
import createInput from './createInputFunction';
/**
 * 格式化Touch事件对象
 */
export default function (el?: HTMLElement) {
    const transform = createInput();

    return function (event: TouchEvent) {
        // tip: wx下没有targetTouches
        const targets: EventTarget[] = [];
        const points: { clientX: number, clientY: number, target: EventTarget }[] = [];
        Array.from(event.touches).forEach(({ clientX, clientY, target }) => {
            // 过滤不在根元素上的触点
            if (el?.contains(target as HTMLElement)) {
                targets.push(target);
                points.push({ clientX, clientY, target });
            }
        });
        const changedPoints = Array.from(event.changedTouches).map(({ clientX, clientY, target }) => ({ clientX, clientY, target }));
        return transform({
            stage: <stage>event.type.replace('touch', ''),
            changedPoints,
            points,
            nativeEvent: event,
            target: event.target,
            targets
        });
    }
}

