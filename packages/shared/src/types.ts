import Core from '@any-touch/core';
import { STATE } from './const';

// export type KV = Record<string | symbol, any>;
export type KV = Record<string, any>;

/**
 * 适配器支持的事件类型
 */
export type NativeEvent = MouseEvent | TouchEvent;

export interface PointClientXY {
    target: EventTarget | null;
    clientX: number;
    clientY: number;
}

/**
 * 输入阶段
 */
export type phase = 'start' | 'move' | 'end' | 'cancel';

/**
 * 原生事件上选取的共有字段
 */
export interface PubicEvent {
    readonly phase: phase;
    readonly changedPoints: PointClientXY[];
    readonly points: PointClientXY[];
    readonly target: EventTarget | null;
    readonly targets: (EventTarget | null)[];
    readonly nativeEvent: Event;
}

/**
 * 不包含prevInput/startInput/startMultiInput的Input
 */
export interface InputOnlyHasCurrent extends PubicEvent {
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
    readonly getOffset: (el: HTMLElement) => { x: number; y: number };
}

/**
 * 提供给插件(compute函数)之前的统一化数据
 */
export interface Input extends InputOnlyHasCurrent {
    readonly startInput: InputOnlyHasCurrent;
    readonly startMultiInput?: InputOnlyHasCurrent;
    readonly prevInput?: InputOnlyHasCurrent;
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
export interface Computed extends KV {
    // 一次识别周期中出现的最大触点数
    readonly maxPointLength?: number;
    // 参与速度计算的触点数量
    // readonly vPointLengh?: number;
    readonly velocityX?: number;
    readonly velocityY?: number;
    readonly speedX?: number;
    readonly speedY?: number;
    readonly scale?: number;
    readonly deltaScale?: number;
    readonly angle?: number;
    readonly deltaAngle?: number;
    readonly deltaX?: number;
    readonly deltaY?: number;
    readonly deltaXYAngle?: number;
    readonly displacementX?: number;
    readonly displacementY?: number;

    readonly distanceX?: number;
    readonly distanceY?: number;
    readonly distance?: number;
    readonly deltaTime?: number;
    // 与起始点的偏移方向
    readonly overallDirection?: directionString;
    // 瞬时方向
    readonly direction?: directionString;
    // 多值形成的向量
    readonly startVecotr?: Vector;
    readonly prevVecotr?: Vector;
    readonly activeVecotr?: Vector;
}

export interface AnyTouchEvent extends Input, Required<Computed> {
    readonly type: string;
    readonly stopPropagation: () => void;
    readonly stopImmediatePropagation: () => void;
    readonly preventDefault: () => void;
}

/**
 * 识别器状态
 */
export type RECOGNIZER_STATE = STATE;

/**
 * Input转换器
 */
export interface InputCreatorFunction<T> {
    (event: T): void | Input;
}


/**
 * Input转换器外壳函数映射
 */
export interface InputCreatorFunctionMap {
    [k: string]: InputCreatorFunction<NativeEvent>;
}


export type PluginOptions = { name?: string } & KV;

/**
 * 插件上下文内容
 */
export type PluginContext<D extends Required<PluginOptions> = Required<PluginOptions>> = { state: RECOGNIZER_STATE, disabled: boolean } & D;

/**
 * 插件
 */
export type Plugin = (context: Core, pluginOptions?: PluginOptions) => PluginContext;


/**
 * 计算函数
 */
export type ComputeFunction = (input: Input, computed: Partial<Computed>) => Computed | void;

/**
 * 计算函数生成器
 */
export type ComputeFunctionCreator = () => ComputeFunction;


/**
 * 仅用来作为识别器和at通知的载体函数
 */
export interface EventTrigger {
    (type: string): void;
}


import tap from '@any-touch/tap';
import press from '@any-touch/press';
import swipe from '@any-touch/swipe';
import pan from '@any-touch/pan';
import pinch from '@any-touch/pinch';
import rotate from '@any-touch/rotate';

export type TapContext = ReturnType<typeof tap>;
export type PressContext = ReturnType<typeof press>;
export type SwipeContext = ReturnType<typeof swipe>;
export type PanContext = ReturnType<typeof pan>;
export type PinchContext = ReturnType<typeof pinch>;
export type RotateContext = ReturnType<typeof rotate>;

/**
 * 插件实例映射
 * {名称: 插件实例}
 */
export interface PluginContextMap {
    tap: TapContext;
    press: PressContext;
    swipe: SwipeContext;
    pan: PanContext;
    pinch: PinchContext;
    rotate: RotateContext;
}


// export type C<Name extends string> = Name extends keyof PluginContextMap ? PluginContextMap[Name] : void;




// 标准class
// export interface StdClass {
//     new(...args: any[]): any;
// }


// type ArrayStuct<Head extends Record<string, number>, Tail extends Record<string, number>[]> = [Head, ...Tail];

// type Merge<Arr extends Record<string, number>[]> =
//     Arr extends [] ? {}
//     : Arr extends ArrayStuct<infer Head, []> ? Head
//     : Arr extends ArrayStuct<infer Head, infer Tail> ? Head & Merge<Tail>
//     : never;

// export type ComputedFromFunction<T extends Record<string, number>[]> = Merge<T>;

// type C = ComputedFromFunction<[{ a: 1 }, { c: 3 }]>


export type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never;

// export type UnionToIntersection1<U> = ((k: U) => void) extends ((k: infer I) => void) ? I : never;

type Result = UnionToIntersection<{ a: 1 } | { b: 2 }>; // T1 & T2