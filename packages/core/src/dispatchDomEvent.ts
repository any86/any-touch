import { Input } from '@any-touch/shared';
/**
 * 触发dom事件
 */
export default function (el: EventTarget, payload: Record<string, any> & Input, eventInit?: EventInit): boolean | void {
    // 过滤不支持的设备
    if (!Event) return;
    // 过滤掉Event上保留的字段(target, currentTarget,type)
    let { target, currentTarget, type, ...data } = payload;
    let event = new Event(type, eventInit);
    Object.assign(event, data, {
        exact: () =>
            payload.targets.every(target =>
                (event.currentTarget as HTMLElement).contains(target as HTMLElement)
            )
    });
    return el.dispatchEvent(event);
}