import { AnyTouchEvent } from '../interface';
import Recognizer from './Base';
export default class PressRecognizer extends Recognizer {
    private _timeoutId?;
    static DEFAULT_OPTIONS: {
        name: string;
        pointLength: number;
        positionTolerance: number;
        minPressTime: number;
    };
    constructor(options?: {});
    getTouchAction(): string[];
    recognize(computed: AnyTouchEvent): void;
    test({ distance }: AnyTouchEvent): boolean;
    cancel(): void;
    afterEmit(): void;
}
