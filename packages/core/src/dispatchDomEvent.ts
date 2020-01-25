/**
 * 触发dom事件
 */
export default function (el: HTMLElement, payload: Record<string, any>) {
    // 过滤掉几个Event上保留的字段(target, currentTarget)
    let { target, currentTarget, type, ...data } = payload;
    let event = new Event(type, payload);
    Object.assign(event, data);
    el.dispatchEvent(event);
}