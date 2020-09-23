// interface AddEvent{
//     <K extends keyof WindowEventMap>(type: K, listener: (this: Window, ev: WindowEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;

//     <K extends keyof HTMLElementEventMap>(el: HTMLElement, type: K, listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void 
// }
// function addEvent<K extends keyof WindowEventMap>(target:Window,type: K, listener: (this: Window, ev: WindowEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;

// function addEvent<K extends keyof HTMLElementEventMap>(target: HTMLElement, type: K, listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;

// function addEvent(target,type,listener,options):void{
//     target.addEventListener(type,listener,options);
// }

import { TOUCH,MOUSE,IS_WX } from '@any-touch/shared';
import type { SupportEvent } from '@any-touch/shared';

const TOUCH_EVENTS = [TOUCH.START, TOUCH.MOVE, TOUCH.END, TOUCH.CANCEL];
/*
* 根据输入设备绑定事件
*/
export default function (
    el: HTMLElement,
    catchEvent: (e: SupportEvent) => void,
    options?: boolean | AddEventListenerOptions,
): () => void {
    TOUCH_EVENTS.forEach(eventName => {
        el.addEventListener(eventName, catchEvent, options);
    });

    if (!IS_WX) {
        el.addEventListener(MOUSE.DOWN, catchEvent, options);
        window.addEventListener(MOUSE.MOVE, catchEvent, options);
        window.addEventListener(MOUSE.UP, catchEvent, options);
    }

    return () => {
        TOUCH_EVENTS.forEach(eventName => {
            el.removeEventListener(eventName, catchEvent);
        });
        if (!IS_WX) {
            el.removeEventListener(MOUSE.DOWN, catchEvent, options);
            window.removeEventListener(MOUSE.MOVE, catchEvent, options);
            window.removeEventListener(MOUSE.UP, catchEvent, options);
        }
    };
}