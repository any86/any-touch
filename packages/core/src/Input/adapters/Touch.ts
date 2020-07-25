import { BaseInput, InputType } from '@any-touch/shared';
import Adapter from './Abstract';
export default class extends Adapter {
    load(event: TouchEvent, el: HTMLElement): Omit<BaseInput, 'id'> {
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
        return {
            inputType: <InputType>event.type.replace('touch', ''),
            changedPoints,
            points,
            nativeEvent: event,
            target: event.target,
            targets
        };
    }
}; 