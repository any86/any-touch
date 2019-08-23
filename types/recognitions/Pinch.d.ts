import { AnyTouchEvent } from '../interface';
import Recognizer from './Base';
export default class PinchRecognizer extends Recognizer {
    private _prevScale;
    static DEFAULT_OPTIONS: {
        name: string;
        threshold: number;
        pointLength: number;
    };
    constructor(options?: {});
    getTouchAction(): string[];
    afterEmit(computed: AnyTouchEvent): void;
    test({ pointLength, scale }: AnyTouchEvent): boolean;
}
