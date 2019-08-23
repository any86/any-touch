import Base from './Base';
import { AnyTouchEvent } from '../interface';
export default class RotateRecognizer extends Base {
    static DEFAULT_OPTIONS: {
        name: string;
        threshold: number;
        pointLength: number;
    };
    constructor(options?: {});
    getTouchAction(): string[];
    afterEmit(computed: AnyTouchEvent): void;
    test({ pointLength, angle }: AnyTouchEvent): boolean;
}
