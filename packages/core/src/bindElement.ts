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

type WType = typeof MOUSE_MOVE | typeof MOUSE_UP;
type EType = typeof TOUCH_START | typeof TOUCH_MOVE | typeof TOUCH_END | typeof TOUCH_CANCEL;





const eTypes = [TOUCH_START, TOUCH_MOVE, TOUCH_END, TOUCH_CANCEL, MOUSE_DOWN];
const wTypes = [MOUSE_MOVE, MOUSE_UP];
/*
 * 根据输入设备绑定事件
 */
export default function (
    el: HTMLElement,
    catchEvent: (e: NativeEvent) => void,
    options?: boolean | AddEventListenerOptions
): () => void {
    eTypes.forEach((type) => {
        el.addEventListener(type, catchEvent, options);
    });

    wTypes.forEach((type) => {
        window.addEventListener(type, catchEvent, options);
    });

    return () => {
        eTypes.forEach((types) => {
            el.removeEventListener(types, catchEvent);
        });

        wTypes.forEach((type) => {
            window.removeEventListener(type, catchEvent);
        });
    };
}
