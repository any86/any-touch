/**
 * 触发dom事件
 */
export default function (el: HTMLElement, payload: Record<string, any>, eventInit?: EventInit): boolean | void {
    // 过滤不支持的设备
    if (!Event) return;
    // 过滤掉Event上保留的字段(target, currentTarget,type)
    let { target, currentTarget, type, ...data } = payload;
    let event = new Event(type, eventInit);
    Object.assign(event, data);
    return el.dispatchEvent(event);
}