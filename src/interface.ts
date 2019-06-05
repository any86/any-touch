export type directionString = 'up' | 'right' | 'down' | 'left' | 'none';
export type RecognizerStatus = 'possible' | 'recognized' | 'began' | 'changed' | 'ended' | 'failed' | 'cancelled';
export type eventType = 'start' | 'move' | 'end' | 'cancel';

export interface Point {
    x: number;
    y: number;
}

export interface BaseInput {
    eventType: eventType;
    changedPoints: { clientX: number, clientY: number }[];
    points: { clientX: number, clientY: number }[];
    nativeEvent: Event;
}

export interface Input extends BaseInput {
    preventDefault: () => void;
    // 新一轮手势识别的开始和结束
    isFirst: boolean;
    isFinal: boolean;
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
    // functions?: { [k: string]: (...args: any[]) => any };
}
// input的计算结果
export interface Computed extends Input {

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
    overallDirection?: string;
    // 瞬时方向
    direction?: string;
}

export interface AnyTouchEvent extends Computed {
    // 手势类型名: pan/panstart/panleft...
    type: string;
}