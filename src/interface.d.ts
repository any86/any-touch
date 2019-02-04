
export type directionString = 'up' | 'right' | 'down' | 'left';
export type RecognizerStatus = 'possible' | 'recognized' | 'began' | 'changed' | 'ended' | 'failed' | 'cancelled';

export interface Input {
    // 新一轮手势识别的开始
    isFirst: boolean;
    isFinal: boolean;
    inputStatus: 'start' | 'move' | 'end' | 'cancel'; 
    nativeEvent: Event;
    pointer: { clientX: number, clientY: number }[];
    pointerLength: number;
    // 发生改变的触点数据
    changedPointers: { clientX: number, clientY: number }[];
    changedPointerLength: number;
    // 当前时间
    timestamp: number;
    target: EventTarget;
    currentTarget?: EventTarget;
    centerX: number;
    centerY: number;
    // functions?: { [k: string]: (...args: any[]) => any };
}
// input的计算结果
export interface Computed extends Input {
    // 手势类型名: pan/panstart/panleft...
    type: string;
    // 一次识别周期中出现的最大触点数
    maxPointerLength?: number;
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
    deltaX: number;
    deltaY: number;
    deltaXYAngle: number;
    displacementX: number;
    displacementY: number;
    distanceX: number;
    distanceY: number;
    distance: number;
    duration: number;
    // 与起始点的偏移方向
    direction?: directionString;
    // 最近的方向
    lastDirection?: directionString;
    // 2次input的时间差
    deltaTime?: number;
}