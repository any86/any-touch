import { STATUS_POSSIBLE, STATUS_START, STATUS_MOVE, STATUS_END, STATUS_CANCELLED, STATUS_FAILED, STATUS_RECOGNIZED } from '@any-touch/shared';
import Base from '@any-touch/recognizer';
/**
 * 基础识别器类型
 */
export type Recognizer = Base;
export type AnyTouchPlugin = any;

/**
 * 适配器支持的事件类型
 */
export type SupportEvent = MouseEvent | TouchEvent;

export interface PointClientXY { target: EventTarget | null, clientX: number, clientY: number };

/**
 * 输入阶段
 */
export type stage = 'start' | 'move' | 'end' | 'cancel';

/**
 * 原生事件对象最基础的统一化
 */
export interface BasicsInput {
    readonly stage: stage;
    readonly changedPoints: PointClientXY[];
    readonly points: PointClientXY[];
    readonly target: EventTarget | null;
    readonly targets: (EventTarget | null)[];
    readonly nativeEvent: Event;
}


/**
 * 不包含prevInput/startInput/startMultiInput的Input
 */
export interface InputOnlyHasCurrent extends BasicsInput {
    readonly id: number;
    // readonly preventDefault: () => void;
    // 新一轮手势识别的开始和结束
    readonly isStart: boolean;
    readonly isEnd: boolean;
    readonly pointLength: number;
    // 发生改变的触点数据
    // readonly changedPointLength: number;
    // 当前时间
    readonly timestamp: number;
    readonly target: EventTarget | null;
    readonly currentTarget: EventTarget | null;
    readonly center?: Point;
    // 同centerX/Y
    readonly x: number;
    readonly y: number;
    readonly getOffset: (el: HTMLElement) => { x: number, y: number }
}

/**
 * 统一化event后数据
 */
export interface Input extends InputOnlyHasCurrent {
    readonly startInput: InputOnlyHasCurrent;
    readonly startMultiInput?: InputOnlyHasCurrent;
    readonly prevInput?: InputOnlyHasCurrent;
}

// 标准class
// export interface StdClass {
//     new(...args: any[]): any;
// }

export interface ComputeConstructor {
    _id: string;
    new(...args: any[]): {
        compute(input: Input): Record<string, any> | void;
    };
}

export interface CommonEmitFunction {
    (type: string, ...payload: any[]): void
}

/**
 * 方向
 */
export type directionString = 'up' | 'right' | 'down' | 'left' | 'none';

/**
 * 点
 */
export interface Point {
    x: number;
    y: number;
}

export type Vector = Point;

/**
 * Input执行计算后的数据格式
 */
export interface Computed {
    // 一次识别周期中出现的最大触点数
    maxPointLength?: number;
    velocityX: number;
    velocityY: number;
    speedX: number;
    speedY: number;
    scale: number;
    deltaScale: number;
    angle: number;
    deltaAngle: number;
    deltaX: number;
    deltaY: number;
    deltaXYAngle: number;
    displacementX: number;
    displacementY: number;

    distanceX: number;
    distanceY: number;
    distance: number;
    deltaTime: number;
    // 与起始点的偏移方向
    overallDirection?: directionString;
    // 瞬时方向
    direction?: directionString;
}

export interface AnyTouchEvent extends Input, Readonly<Computed> {
    readonly type: string
}

/**
 * 识别器状态
 */
export type RecognizerStatus = typeof STATUS_POSSIBLE | typeof STATUS_START | typeof STATUS_MOVE | typeof STATUS_END | typeof STATUS_CANCELLED | typeof STATUS_FAILED | typeof STATUS_RECOGNIZED;
