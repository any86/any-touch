import Recognizer from './Base';
import { AnyTouchEvent } from '../interface';
export default class SwipeRecognizer extends Recognizer {
    static DEFAULT_OPTIONS: {
        name: string;
        threshold: number;
        velocity: number;
        pointLength: number;
        directions: string[];
    };
    constructor(options?: {});
    getTouchAction(): string[];
    afterEmit(computed: AnyTouchEvent): void;
    test(computed: AnyTouchEvent): boolean;
}
