import { directionString, Point } from './interface';
export declare const getVLength: (v: Point) => number;
export declare const getDotProduct: (v1: Point, v2: Point) => number;
export declare const getRadian: (v1: Point, v2: Point) => number;
export declare const getCross: (v1: Point, v2: Point) => number;
export declare const getAngle: (v1: Point, v2: Point) => number;
export declare const radianToAngle: (radian: number) => number;
export declare const angleToRadian: (angle: number) => number;
export declare const getCenter: (points: {
    clientX: number;
    clientY: number;
}[]) => Point;
export declare const getDirection: (x: number, y: number) => directionString;
