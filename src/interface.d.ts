export interface AnyPointers {
    isStart: boolean,
    isMove: boolean,
    isEnd: boolean,
    deltaX: number,
    deltaY: number,
    prevPointers?: TouchList,
    startPointers?: TouchList,
    activePointers?: TouchList,
    endPointers?: TouchList,
    startTime?: number,
    activeTime?: number,
    endTime?: number,
    length?: number
}

export interface Session extends AnyPointers {}

export interface EventHandler {
    rotate?: EventListener;
    pinch?: EventListener;
    tap?: EventListener;
    doubletap?: EventListener;
    press?: EventListener;
    pan?: EventListener;
    swipe?: EventListener;
    touchStart?: EventListener;
    touchMove?: EventListener;
    touchEnd?: EventListener;
}

export interface Recognizer {
    type: String;
    computedData: Function;
    start?: Function;
    move?: Function;
    end?: Function;
}

export interface Vector {
    x: number;
    y: number;
}

export interface EventHandler {
    rotate?: EventListener;
    pinch?: EventListener;
    tap?: EventListener;
    doubletap?: EventListener;
    press?: EventListener;
    pan?: EventListener;
    swipe?: EventListener;
    touchStart?: EventListener;
    touchMove?: EventListener;
    touchEnd?: EventListener;
}

export interface Recognizer {
    type: String;
    computedData: Function;
    start?: Function;
    move?: Function;
    end?: Function;
}
