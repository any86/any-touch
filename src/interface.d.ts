
export type directionString = 'up' | 'right' | 'down' | 'left' | 'none' | 'all';
export type inputType = 'start' | 'move' | 'end' | 'cancel';
export type RecognizerStatus = 'unknown' | 'recognized' | 'began' | 'changed' | 'ended' | 'failed' | 'cancelled';

export interface Input {
    isFirst: boolean;
    isFinal: boolean;
    inputType?: inputType;
    nativeEvent?: any;
    pointers: { clientX: number, clientY: number }[];
    pointerLength: number;
    changedPointers: { clientX: number, clientY: number }[];
    changedPointerLength: number;
    timestamp: number;
    target?: EventTarget;
    currentTarget?: EventTarget;
    centerX?: number;
    centerY?: number;
    stopPropagation?: () => void;
    preventDefault?: () => void;
    stopImmediatePropagation?: () => void;
}
// input的计算结果
export interface Computed extends Input {
    type?: string;
    inputType?: inputType; //start | move | end | cancel
    length?: number;
    maxLength?: number;
    lastVelocity: number;
    lastVelocityX: number;
    lastVelocityY: number;
    velocityX: number;
    velocityY: number;
    maxVelocity: number;
    scale: number;
    deltaScale: number;
    angle: number;
    deltaAngle: number;
    centerX?: number;
    centerY?: number;
    deltaX: number;
    deltaY: number;
    displacementX: number;
    displacementY: number;
    distanceX: number;
    distanceY: number;
    distance: number;
    duration: number;
    direction: directionString;
    // 最近的方向
    lastDirection: directionString;
    // 2次input的时间差
    deltaTime?: number;
    tapCount?: number;
}

// 识别器中recognize方法返回的数据格式
export interface RecognizerCallbackPaylod extends Computed {
    type: string;
}

export interface RecognizerCallback {
    (paylod: RecognizerCallbackPaylod): void
}


// 事件触发函数
export interface EventHandler {
    (event: Computed): void;
}

// 手势的触发函数
export interface EventBus {
    pinch?: EventHandler[];
    tap?: EventHandler[];
    doubletap?: EventHandler[];
    press?: EventHandler[];
    pan?: EventHandler[];
    swipe?: EventHandler[];
    touchStart?: EventHandler[];
    touchMove?: EventHandler[];
    touchEnd?: EventHandler[];
    // [key:string]: any;
    [propsName: string]: EventHandler[];
}


// 向量
export interface Vector {
    x: number;
    y: number;
}