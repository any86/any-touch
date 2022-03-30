import { AnyTouchEvent } from '@any-touch/shared';
import type { SupportElement } from 'any-touch';

/**
 * 触发dom事件
 */
export default function (typeName: string, el: EventTarget, payload: Partial<AnyTouchEvent>, eventInit?: EventInit): boolean | void {
    // 过滤掉Event上保留的字段(target, currentTarget,type)
    let { target, currentTarget, type, ...data } = payload;
    let event: Event;
    if (document.createEvent) {
        event = document.createEvent('HTMLEvents');
        event.initEvent(typeName, eventInit?.bubbles, eventInit?.cancelable);
    } else {
        event = new Event(typeName, eventInit);
    }

    Object.assign(event, data, {
        match: () =>
            payload.targets && 0 < payload.targets.length && payload.targets.every((target) => (event.currentTarget as SupportElement).contains(target as SupportElement)),
    });
    return el.dispatchEvent(event);
}
