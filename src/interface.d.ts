// AnyTouch手势的事件数据
export interface AnyTouchEvent {
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

export interface Session extends AnyTouchEvent { }

// 手势的触发函数
export interface HandlerBus {
    rotate?: [(event: AnyTouchEvent) => void];
    pinch?: [(event: AnyTouchEvent) => void];
    tap?: [(event: AnyTouchEvent) => void];
    doubletap?: [(event: AnyTouchEvent) => void];
    press?: [(event: AnyTouchEvent) => void];
    pan?: [(event: AnyTouchEvent) => void];
    swipe?: [(event: AnyTouchEvent) => void];
    touchStart?: [(event: AnyTouchEvent) => void];
    touchMove?: [(event: AnyTouchEvent) => void];
    touchEnd?: [(event: AnyTouchEvent) => void];
}


export interface Recognizer {
    type: String;
    computedData: Function;
    start?: Function;
    move?: Function;
    end?: Function;
}

// 向量
export interface Vector {
    x: number;
    y: number;
}
