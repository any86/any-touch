interface Options {
    touchAction?: 'compute' | 'auto' | 'manipulation' | 'pan-x' | 'pan-y' | 'none';
    domEvents?: boolean;
}
declare class AnyTouch {
    static TapRecognizer:any;
    static PressRecognizer:any;
    static PanRecognizer:any;
    static SwipeRecognizer:any;
    static PinchRecognizer:any;
    static RotateRecognizer:any;

    // 目标元素
    el: HTMLElement;

    // 各个手势对应的handle集合
    eventEmitter: any;

    recognizers: { [propName: string]: any, name: string }[];

    unbinders: any[];

    version: string;

    isMobile: boolean;

    options: Options;

    constructor(el: HTMLElement, options?:Options);

    setTouchAction(el: HTMLElement):void;

    add(recognizer: any):void;

    get(name: string): any;

    set(options?: Options):void;

    remove(recognizerName: string):void;

    handler(event: TouchEvent|MouseEvent):void

    on(eventName: string, callback: any):void;

    off(eventName: string, handler?: any): void;

    destroy():void;
}
export default AnyTouch;