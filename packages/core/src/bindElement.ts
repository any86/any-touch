import { SupportEvent, SUPPORT_TOUCH, TOUCH_START, TOUCH_MOVE, TOUCH_END, TOUCH_CANCEL, MOUSE_DOWN, MOUSE_MOVE, MOUSE_UP } from '@any-touch/shared';
const TOUCH_EVENT_NAMES = [TOUCH_START, TOUCH_MOVE, TOUCH_END, TOUCH_CANCEL];

// interface AddEvent{
//     <K extends keyof WindowEventMap>(type: K, listener: (this: Window, ev: WindowEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;

//     <K extends keyof HTMLElementEventMap>(el: HTMLElement, type: K, listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void 
// }
// function addEvent<K extends keyof WindowEventMap>(target:Window,type: K, listener: (this: Window, ev: WindowEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;

// function addEvent<K extends keyof HTMLElementEventMap>(target: HTMLElement, type: K, listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;

// function addEvent(target,type,listener,options):void{
//     target.addEventListener(type,listener,options);
// }

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
        el.addEventListener(MOUSE_DOWN, callback, options);
        window.addEventListener(MOUSE_MOVE, callback, options);
        window.addEventListener(MOUSE_UP, callback, options);
        return () => {
            el.removeEventListener(MOUSE_DOWN, callback);
            window.removeEventListener(MOUSE_MOVE, callback);
            window.removeEventListener(MOUSE_UP, callback);
        };
    }
}