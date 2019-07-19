// 适配器支持的事件类型
export type SupportEvent = MouseEvent | TouchEvent;

export type directionString = 'up' | 'right' | 'down' | 'left' | 'none';
export type RecognizerStatus = 'possible' | 'recognized' | 'began' | 'changed' | 'ended' | 'failed' | 'cancelled';
export type eventType = 'start' | 'move' | 'end' | 'cancel';

export interface Point {
    x: number;
    y: number;
}

export interface BaseInput {
    readonly eventType: eventType;
    readonly changedPoints: { clientX: number, clientY: number }[];
    readonly points: { clientX: number, clientY: number }[];
    readonly nativeEvent: Event;
}

export type Input = Readonly<{
    preventDefault: () => void;
    // 新一轮手势识别的开始和结束
    isStart: boolean;
    isEnd: boolean;
    pointLength: number;
    // 发生改变的触点数据
    changedPointLength: number;
    // 当前时间
    timestamp: number;
    target: EventTarget | null;
    currentTarget: EventTarget | null;
    center?: Point;
    // 同centerX/Y
    x: number;
    y: number;
} & BaseInput>

// input的计算结果
export interface Computed extends Input {
    type: string;
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
};

export interface AnyTouchEvent extends Computed {
    // 手势类型名: pan/panstart/panleft...
    type: string;
}