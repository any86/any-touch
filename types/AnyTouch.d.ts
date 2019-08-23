import { AnyTouchEvent, SupportEvent } from './interface';
import AnyEvent from 'any-event';
import InputManage from './InputManage';
import Store from './Store';
import Recognizer from './recognitions/Base';
import Tap from './recognitions/Tap';
import Press from './recognitions/Press';
import Pan from './recognitions/Pan';
import Swipe from './recognitions/Swipe';
import Pinch from './recognitions/Pinch';
import Rotate from './recognitions/Rotate';
import * as Vector from './vector';
interface Options {
    touchAction?: 'compute' | 'auto' | 'manipulation' | 'pan-x' | 'pan-y' | 'none';
    hasDomEvents?: boolean;
    isPreventDefault?: boolean;
    cssPrevent?: {
        selectText?: boolean;
        drag?: boolean;
        tapHighlight?: boolean;
        callout?: boolean;
    };
}
export declare class AnyTouch {
    static Tap: typeof Tap;
    static Press: typeof Press;
    static Pan: typeof Pan;
    static Swipe: typeof Swipe;
    static Pinch: typeof Pinch;
    static Rotate: typeof Rotate;
    static version: string;
    static Vector: typeof Vector;
    static EventEmitter: typeof AnyEvent;
    el?: HTMLElement;
    default: Options;
    touchDevice: string;
    recognizers: Recognizer[];
    options: Options;
    eventEmitter: AnyEvent;
    inputManage: InputManage;
    $store: Store;
    private _isStopped;
    constructor(el?: HTMLElement, options?: Options);
    updateTouchAction(): void;
    updateCssPrevent(): void;
    update(): void;
    private _bindEL;
    useEvent(event: SupportEvent): void;
    add(recognizer: Recognizer): void;
    get(name: string): Recognizer | undefined;
    set(options: Options): void;
    stop(): void;
    remove(recognizerName: string): void;
    inputListener(event: SupportEvent): void;
    on(type: string, listener: (event: AnyTouchEvent) => void, options?: {
        [k: string]: boolean;
    } | boolean): void;
    off(type: string, listener?: (event: AnyTouchEvent) => void): void;
    emit(type: string, payload: AnyTouchEvent): void;
    unbind(): void;
    destroy(): void;
}
export {};
