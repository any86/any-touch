import Base from '@any-touch/recognizer';
export type Recognizer = Base;
export type AnyTouchPlugin = any;

// 适配器支持的事件类型
export type SupportEvent = MouseEvent | TouchEvent;

export interface PointClientXY { target: EventTarget | null, clientX: number, clientY: number };
// 输入类型
export type InputType = 'start' | 'move' | 'end' | 'cancel';

// 事件统一变形
export interface BaseInput {
    readonly id: number;
    readonly inputType: InputType;
    readonly changedPoints: PointClientXY[];
    readonly points: PointClientXY[];
    readonly target: EventTarget | null;
    readonly targets: (EventTarget | null)[];
    readonly nativeEvent: Event;
}


// 不包含prevInput等表示记录的input
export interface PureInput extends BaseInput {
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
    readonly getOffset: (el: HTMLElement | SVGElement) => { x: number, y: number }
}

export interface Input extends PureInput {
    readonly startInput: PureInput;
    readonly startMultiInput?: PureInput;
    readonly prevInput?: PureInput;
}

// 标准class
export interface StdClass {
    new(...args: any[]): any;
}


export interface ComputeConstructor {
    _id: string;
    new(...args: any[]): {
        compute(input: Input): Record<string, any> | void;
    };
}

export interface CommonEmitFunction {
    (type: string, ...payload: any[]): void
}




export type directionString = 'up' | 'right' | 'down' | 'left' | 'none';
export type RecognizerStatus = 'possible' | 'recognized' | 'began' | 'changed' | 'ended' | 'failed' | 'cancelled';


export interface Point {
    x: number;
    y: number;
}

export type Vector = Point;

// 输入记录
export type InputRecord = {
    input: Input;
    startInput: Input;
    prevInput?: Input;
    startMultiInput?: Input;
}



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
