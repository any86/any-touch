// interface AddEvent{
//     <K extends keyof WindowEventMap>(type: K, listener: (this: Window, ev: WindowEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;

//     <K extends keyof HTMLElementEventMap>(el: HTMLElement, type: K, listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void 
// }
// function addEvent<K extends keyof WindowEventMap>(target:Window,type: K, listener: (this: Window, ev: WindowEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;

// function addEvent<K extends keyof HTMLElementEventMap>(target: HTMLElement, type: K, listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;

// function addEvent(target,type,listener,options):void{
//     target.addEventListener(type,listener,options);
// }

import type { NativeEvent } from '@any-touch/shared';

import { TOUCH_START, TOUCH_MOVE, TOUCH_END, TOUCH_CANCEL, MOUSE_DOWN, MOUSE_MOVE, MOUSE_UP } from '@any-touch/shared';
const TOUCH_EVENTS = [TOUCH_START, TOUCH_MOVE, TOUCH_END, TOUCH_CANCEL];

/*
* 根据输入设备绑定事件
*/
export default function (
    el: HTMLElement,
    catchEvent: (e: NativeEvent) => void,
    options?: boolean | AddEventListenerOptions,
): () => void {
    TOUCH_EVENTS.forEach(eventName => {
        el.addEventListener(eventName, catchEvent, options);
    });

    el.addEventListener(MOUSE_DOWN, catchEvent, options);
    window.addEventListener(MOUSE_MOVE, catchEvent, options);
    window.addEventListener(MOUSE_UP, catchEvent, options);

    return () => {
        TOUCH_EVENTS.forEach(eventName => {
            el.removeEventListener(eventName, catchEvent);
        });
        el.removeEventListener(MOUSE_DOWN, catchEvent, options);
        window.removeEventListener(MOUSE_MOVE, catchEvent, options);
        window.removeEventListener(MOUSE_UP, catchEvent, options);
    };
}