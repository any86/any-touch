import { SupportEvent, SUPPORT_TOUCH, TOUCH_START, TOUCH_MOVE, TOUCH_END, TOUCH_CANCEL, MOUSE_DOWN, MOUSE_MOVE, MOUSE_UP } from '@any-touch/shared';
const TOUCH_EVENT_NAMES: ["touchstart", "touchmove", "touchend", "touchcancel"] = [TOUCH_START, TOUCH_MOVE, TOUCH_END, TOUCH_CANCEL];


/*
* 根据输入设备绑定事件
*/
export default function (el: HTMLElement, callback: (ev: SupportEvent) => void, options?: boolean | AddEventListenerOptions): () => void {
    // Touch
    if (SUPPORT_TOUCH) {
        // https://stackoverflow.com/questions/55092588/typescript-addeventlistener-set-event-type
        TOUCH_EVENT_NAMES.forEach((eventName) => {
            el.addEventListener(eventName, callback, options);
        });
        return () => {
            TOUCH_EVENT_NAMES.forEach((eventName) => {
                el.removeEventListener(eventName, callback);
            });
        };
    }
    // Mouse
    else {
        el.addEventListener('mousedown', callback, options);
        window.addEventListener('mousemove', callback, options);
        window.addEventListener('mouseup', callback, options);
        return () => {
            el.removeEventListener('mousedown', callback);
            window.removeEventListener('mousemove', callback);
            window.removeEventListener('mouseup', callback);
        };
    }
}