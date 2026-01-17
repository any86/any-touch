import type { phase } from '@any-touch/shared';
import inputCreator from './inputCreator';
/**
 * 格式化Touch事件对象
 */
export default function (el?: Element) {
    const createInput = inputCreator();

    return function (event: TouchEvent) {
        // tip: wx下没有targetTouches
        const targets: EventTarget[] = [];
        const points: { clientX: number, clientY: number, target: EventTarget }[] = [];
        Array.from(event.touches).forEach(({ clientX, clientY, target }) => {
            // 过滤不在根元素上的触点
            if (el?.contains(target as Element)) {
                targets.push(target);
                points.push({ clientX, clientY, target });
            }
            // 未指定根元素的情况下，应当将所有touch点都视作有效，
            // 否则points为空，将会报错
            if (!el) {
                if (target) targets.push(target);
                points.push({ clientX, clientY, target });
            }
        });
        const changedPoints = Array.from(event.changedTouches).map(({ clientX, clientY, target }) => ({ clientX, clientY, target }));
        return createInput({
            phase: <phase>event.type.replace('touch', ''),
            changedPoints,
            points,
            nativeEvent: event,
            target: event.target,
            targets
        });
    }
}

