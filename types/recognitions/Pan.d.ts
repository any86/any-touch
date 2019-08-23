import { AnyTouchEvent, Computed } from '../interface';
import Recognizer from './Base';
export default class PanRecognizer extends Recognizer {
    static DEFAULT_OPTIONS: {
        name: string;
        threshold: number;
        pointLength: number;
        directions: string[];
    };
    constructor(options?: {});
    getTouchAction(): string[];
    test({ distance, direction, eventType, pointLength }: AnyTouchEvent): boolean;
    afterEmit(computed: AnyTouchEvent): void;
    afterRecognized(computed: AnyTouchEvent): void;
    lockDirection(computed: Computed): Computed;
}
