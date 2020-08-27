// interface AddEvent{
//     <K extends keyof WindowEventMap>(type: K, listener: (this: Window, ev: WindowEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;

//     <K extends keyof HTMLElementEventMap>(el: HTMLElement, type: K, listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void 
// }
// function addEvent<K extends keyof WindowEventMap>(target:Window,type: K, listener: (this: Window, ev: WindowEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;

// function addEvent<K extends keyof HTMLElementEventMap>(target: HTMLElement, type: K, listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;

// function addEvent(target,type,listener,options):void{
//     target.addEventListener(type,listener,options);
// }

import InputFactory from './Input';
import { SupportEvent, TOUCH_START, TOUCH_MOVE, TOUCH_END, TOUCH_CANCEL, MOUSE_DOWN, MOUSE_MOVE, MOUSE_UP } from '@any-touch/shared';
const TOUCH_EVENTS = [TOUCH_START, TOUCH_MOVE, TOUCH_END, TOUCH_CANCEL];

/*
* 根据输入设备绑定事件
*/
export default function (
    el: HTMLElement,
    catchEvent: (e: SupportEvent, transformToInput: any) => void,
    adapters: any[],
    options?: boolean | AddEventListenerOptions,
): () => void {


    function transfromTouch(e: SupportEvent) {
        catchEvent(e, adapters[0])
    }

    function transfromMouse(e: SupportEvent) {
        catchEvent(e, adapters[1])
    }

    TOUCH_EVENTS.forEach(eventName => {
        el.addEventListener(eventName, transfromTouch, options);
    });

    el.addEventListener(MOUSE_DOWN, transfromMouse, options);
    window.addEventListener(MOUSE_MOVE, transfromMouse, options);
    window.addEventListener(MOUSE_UP, transfromMouse, options);


    return () => {
        TOUCH_EVENTS.forEach(eventName => {
            el.removeEventListener(eventName, transfromTouch);
        });

        el.removeEventListener(MOUSE_DOWN, transfromMouse, options);
        window.removeEventListener(MOUSE_MOVE, transfromMouse, options);
        window.removeEventListener(MOUSE_UP, transfromMouse, options);
    };
}