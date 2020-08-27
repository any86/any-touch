import { Input } from '@any-touch/shared';
/**
 * 触发dom事件
 */
export default function (el: EventTarget, payload: Record<string, any> & Input, eventInit?: EventInit): boolean | void {
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
            payload.targets.every(target =>
                (event.currentTarget as HTMLElement).contains(target as HTMLElement)
            )
    });
    // if('panmove' == event.type)  console.log(event.type,el)
    return el.dispatchEvent(event);
}