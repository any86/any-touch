// interface AddEvent{
//     <K extends keyof WindowEventMap>(type: K, listener: (this: Window, ev: WindowEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;

//     <K extends keyof HTMLElementEventMap>(el: HTMLElement, type: K, listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void
// }
// function addEvent<K extends keyof WindowEventMap>(target:Window,type: K, listener: (this: Window, ev: WindowEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;

// function addEvent<K extends keyof HTMLElementEventMap>(target: HTMLElement, type: K, listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;

// function addEvent(target,type,listener,options):void{
//     target.addEventListener(type,listener,options);
// }

import type { SupportElement } from 'any-touch';
import type { NativeEvent } from '@any-touch/shared';
import { TOUCH_START, TOUCH_MOVE, TOUCH_END, TOUCH_CANCEL, MOUSE_DOWN, MOUSE_MOVE, MOUSE_UP } from './const';
const ELEMENT_TYPES = [TOUCH_START, TOUCH_MOVE, TOUCH_END, TOUCH_CANCEL, MOUSE_DOWN] as const;
const WINDOW_TYPES = [MOUSE_MOVE, MOUSE_UP] as const;
/*
 * 根据输入设备绑定事件
 */
export default function (
    el: SupportElement,
    catchEvent: (e: NativeEvent) => void,
    options?: boolean | AddEventListenerOptions
): () => void {
    ELEMENT_TYPES.forEach((type) => {
        el.addEventListener(type, catchEvent as any, options);
    });

    WINDOW_TYPES.forEach((type) => {
        window.addEventListener(type, catchEvent, options);
    });

    return () => {
        ELEMENT_TYPES.forEach((types) => {
            el.removeEventListener(types, catchEvent as any);
        });

        WINDOW_TYPES.forEach((type) => {
            window.removeEventListener(type, catchEvent);
        });
    };
}
