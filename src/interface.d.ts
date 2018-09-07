export interface InputComputed {
    velocityX: number;
    velocityY:number;
    maxVelocity:number;
    scale:number;
    angle:number;
    centerX:number;
    centerY:number;
    deltaX:number;
    deltaY:number;
    absDeltaX:number;
    absDeltaY:number;
    displacementX:number;
    displacementY:number;
    distanceX:number;
    distanceY:number;
    distance: number;
    duration:number;
}

// AnyTouch手势的事件数据
export interface AnyTouchEvent {
    type: string;
    eventBus: object,
    velocityX: number;
    velocityY:number;
    maxVelocity:number;
    scale:number;
    angle:number;
    centerX:number;
    centerY:number;
    deltaX:number;
    deltaY:number;
    absDeltaX:number;
    absDeltaY:number;
    displacementX:number;
    displacementY:number;
    distanceX:number;
    distanceY:number;
    distance: number;
    duration:number;
}

// 事件触发函数
export interface AnyTouchHandler {
    (event: AnyTouchEvent): void;
}

// 手势的触发函数
export interface HandlerBus {
    pinch?: AnyTouchHandler[];
    tap?: AnyTouchHandler[];
    doubletap?: AnyTouchHandler[];
    press?: AnyTouchHandler[];
    pan?: AnyTouchHandler[];
    swipe?: AnyTouchHandler[];
    touchStart?: AnyTouchHandler[];
    touchMove?: AnyTouchHandler[];
    touchEnd?: AnyTouchHandler[];
    // [key:string]: any;
    [propsName: string]: AnyTouchHandler[];
}

// 统一各种设备的输入
export interface AnyInput {
    isStart: boolean,
    isMove: boolean,
    isEnd: boolean,
    // 上一点
    prevPointers?: TouchList,
    // 起始点
    startPointers?: TouchList,
    // 当前点
    activePointers?: TouchList,
    // 离开时的触点
    endPointers?: TouchList, 
    startTime?: number,
    activeTime?: number,
    endTime?: number,
    length?: number
}

// 向量
export interface Vector {
    x: number;
    y: number;
}