import { AnyTouchEvent, Point } from '../interface';
import Recognizer from './Base';
export default class TapRecognizer extends Recognizer {
    tapCount: number;
    prevTapPoint?: Point;
    prevTapTime?: number;
    isValidDistanceFromPrevTap?: boolean;
    private _delayFailTimer?;
    private _waitOtherFailedTimer?;
    static DEFAULT_OPTIONS: {
        name: string;
        pointLength: number;
        tapTimes: number;
        waitNextTapTime: number;
        disabled: boolean;
        positionTolerance: number;
        tapsPositionTolerance: number;
        maxPressTime: number;
    };
    constructor(options?: {});
    getTouchAction(): string[];
    private _isValidDistanceFromPrevTap;
    private _isValidInterval;
    recognize(computed: AnyTouchEvent): void;
    reset(): void;
    test(computed: AnyTouchEvent): boolean;
    afterEmit(computed: AnyTouchEvent): void;
}
