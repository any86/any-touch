import {
    STATUS_POSSIBLE,
    STATUS_START, STATUS_MOVE,
    STATUS_END, STATUS_CANCELLED,
    STATUS_FAILED, STATUS_RECOGNIZED
} from '@any-touch/shared';
/**
 * 基础识别器类型
 */
export type AnyTouchPlugin = any;

/**
 * 计算函数
 */
export interface ComputeFunction {
    (input: Input): Partial<Computed> | void;
}
/**
 * 计算函数外壳函数
 */
export interface ComputeWrapFunction {
    (): ComputeFunction;
    _id: string;
}

/**
 * 仅用来作为识别器和at通知的载体函数
 */
export interface EventTrigger {
    (type: string): void
}


/**
 * 识别器选项
 */
// export type RecognizerOptions<DEFAULT_OPTIONS = object> = Partial<Omit<DEFAULT_OPTIONS, 'name'>>
//     & { name: string };


export type RecognizerOptions<DEFAULT_OPTIONS = {[k:string]:string|number}> = Partial<DEFAULT_OPTIONS>;

/**
 * 识别器上下文
 */
export type RecognizerContext<DEFAULT_OPTIONS = any> = RecognizerOptions<DEFAULT_OPTIONS> & {
    status: RecognizerStatus;
    name: string;
};

/**
 * 识别器实例
 */
export type RecognizerReturn = [RecognizerContext, (computed: Computed, emit: EventTrigger) => void];

/**
 * 识别器构造函数
 */
export interface RecognizerFunction {
    C: ComputeWrapFunction[];
    (options?: RecognizerOptions): RecognizerReturn;
}



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

// export interface ComputeConstructor {
//     _id: string;
//     new(...args: any[]): {
//         compute(input: Input): Record<string, any> | void;
//     };
// }



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
 * 仅仅是获取scale/angle的前置计算值
 */
export interface VS {
    prevV: Point, startV: Point, activeV: Point
}


/**
 * Input执行计算后的数据格式
 */
export interface Computed extends Input {
    // 一次识别周期中出现的最大触点数
    readonly maxPointLength: number;
    readonly velocityX: number;
    readonly velocityY: number;
    readonly speedX: number;
    readonly speedY: number;
    readonly scale: number;
    readonly deltaScale: number;
    readonly angle: number;
    readonly deltaAngle: number;
    readonly deltaX: number;
    readonly deltaY: number;
    readonly deltaXYAngle: number;
    readonly displacementX: number;
    readonly displacementY: number;

    readonly distanceX: number;
    readonly distanceY: number;
    readonly distance: number;
    readonly deltaTime: number;
    // 与起始点的偏移方向
    readonly overallDirection: directionString;
    // 瞬时方向
    readonly direction: directionString;
}

export interface AnyTouchEvent extends Input, Readonly<Computed> {
    readonly type: string
}

/**
 * 识别器状态
 */
export type RecognizerStatus = typeof STATUS_POSSIBLE | typeof STATUS_START | typeof STATUS_MOVE | typeof STATUS_END | typeof STATUS_CANCELLED | typeof STATUS_FAILED | typeof STATUS_RECOGNIZED;

/**
 * Input转换器
 */
export interface InputCreatorFunction<T> {
    (event: T): void | Input;
}

export interface InputCreatorWrapFunction {
    (el?: HTMLElement): InputCreatorFunction<TouchEvent>;
    (): InputCreatorFunction<MouseEvent>;
}

/**
 * Input转换器外壳函数映射
 */
export interface InputCreatorFunctionMap {
    [k: string]: InputCreatorFunction<SupportEvent>;
}