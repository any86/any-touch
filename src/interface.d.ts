export type status = 'start' | 'move' | 'end' | 'cancel';

import Input from './input/index';
export interface AnyInput extends Input {}
// input的计算结果
export interface Computed {
    status: status; //start | move | end | cancel
    length: number;
    maxLength: number;
    lastVelocityX: number;
    lastVelocityY: number;
    velocityX: number;
    velocityY: number;
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
    direction: string;
}

// 识别器中recognize方法返回的数据格式
export interface RecognizerCallbackPaylod extends Computed {
    type: string;
}

export interface RecognizerCallback {
    (paylod: RecognizerCallbackPaylod): void
}

// AnyTouch手势的事件数据
export interface AnyPointers {
    centerX: number;
    centerY: number;
}

// 事件触发函数
export interface EventHandler {
    (event: AnyPointers): void;
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