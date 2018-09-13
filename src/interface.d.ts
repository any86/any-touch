interface Session {
    // 输入状态: start | move | end | cancel
    inputStatus: string;
    maxLength?: number;


    eventBus?: any;
    startInput?: any;
    lastInputArray?: any[];
    input?: any;
    prevInput?: any;
    startMultiInput?: any;
    validInput?: any;
    endInput?: any;
    deltaX?: number,
    deltaY?: number,
    lastDeltaTime?: number
}


// 统一各种设备的输入
export interface AnyTouch {
    // 上一触点
    prevInput?: TouchList;
    // 起始触点
    startInput?: TouchList;
    // 当前触点
    input?: TouchList;
    // 离开时的触点
    endInput?: TouchList;
    // 可用点(有位置信息的点), 主要为了让触发离开的时候去最后离开时候的触点
    validPointers?: TouchList;
    // 重新计算时候的起点
    restartInput?: TouchList;
    reStartTime?: number;
    // 开始时间点
    startTime?: number;
    // 当前时间点
    activeTime?: number;
    // 结束的事件点
    endTime?: number;
    // 上一个触碰时间
    prevTime?: number;
    //  当前触点
    length?: number;
    // 出现过的最大触点数
    maxLength?: number;

    deltaX?: number;
    deltaY?: number;


}

export interface InputComputed {
    lastVelocityX: number;
    lastVelocityY: number;
    velocityX: number;
    velocityY: number;
    maxVelocity: number;
    scale: number;
    angle: number;
    centerX: number;
    centerY: number;
    deltaX: number;
    deltaY: number;
    absDeltaX: number;
    absDeltaY: number;
    displacementX: number;
    displacementY: number;
    distanceX: number;
    distanceY: number;
    distance: number;
    duration: number;
}

// AnyTouch手势的事件数据
export interface AnyPointers {
    type: string;
    eventBus: object,
    velocityX: number;
    velocityY: number;
    maxVelocity: number;
    scale: number;
    angle: number;
    centerX: number;
    centerY: number;
    deltaX: number;
    deltaY: number;
    absDeltaX: number;
    absDeltaY: number;
    displacementX: number;
    displacementY: number;
    distanceX: number;
    distanceY: number;
    distance: number;
    duration: number;
}

// 事件触发函数
export interface AnyTouchHandler {
    (event: AnyPointers): void;
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


// 向量
export interface Vector {
    x: number;
    y: number;
}