import _Store from './Store';
export declare type Store = _Store;
export declare type SupportEvent = MouseEvent | TouchEvent;
export declare type directionString = 'up' | 'right' | 'down' | 'left' | 'none';
export declare type RecognizerStatus = 'possible' | 'recognized' | 'began' | 'changed' | 'ended' | 'failed' | 'cancelled';
export declare type eventType = 'start' | 'move' | 'end' | 'cancel';
export interface Point {
    x: number;
    y: number;
}
export declare type Vector = Point;
export declare type InputRecord = {
    input: Input;
    startInput: Input;
    prevInput?: Input;
    startMultiInput?: Input;
};
export interface BaseInput {
    readonly eventType: eventType;
    readonly changedPoints: {
        clientX: number;
        clientY: number;
    }[];
    readonly points: {
        clientX: number;
        clientY: number;
    }[];
    readonly nativeEvent: Event;
}
export interface Input extends BaseInput {
    readonly preventDefault: () => void;
    readonly isStart: boolean;
    readonly isEnd: boolean;
    readonly pointLength: number;
    readonly changedPointLength: number;
    readonly timestamp: number;
    readonly target: EventTarget | null;
    readonly currentTarget: EventTarget | null;
    readonly center?: Point;
    readonly x: number;
    readonly y: number;
}
export interface Computed {
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
    overallDirection?: directionString;
    direction?: directionString;
}
export interface AnyTouchEvent extends Input, Readonly<Computed> {
    readonly type: string;
}
export interface CSSPreventMap extends CSSStyleDeclaration {
    'userSelect': 'none';
    'mozUserSelect': 'none';
    'msUserSelect': 'none';
    'webkitUserSelect': 'none';
    'msTouchSelect': 'none';
    'webkitTapHighlightColor': 'rgba(0,0,0,0)';
    'webkitUserDrag': 'none';
    'webkitTouchCallout': 'none';
}
