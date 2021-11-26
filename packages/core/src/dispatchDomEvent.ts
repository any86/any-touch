import { AnyTouchEvent } from '@any-touch/shared';

/**
 * 触发dom事件
 */
export default function (el: EventTarget, payload: AnyTouchEvent, eventInit?: EventInit): boolean | void {
    // 过滤掉Event上保留的字段(target, currentTarget,type)
    let { target, currentTarget, type, ...data } = payload;
    let event: Event;
    if (document.createEvent) {
        event = document.createEvent('HTMLEvents');
        event.initEvent(type, eventInit?.bubbles, eventInit?.cancelable);
    } else {
        event = new Event(type, eventInit);
    }

    Object.assign(event, data, {
        match: () =>
            0 < payload.targets.length && payload.targets.every((target) => (event.currentTarget as HTMLElement).contains(target as HTMLElement)),
    });
    return el.dispatchEvent(event);
}
