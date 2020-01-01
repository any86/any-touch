import { Input } from '@types';
import { INPUT_END } from '@const';
import ComputeDistance from '@any-touch/compute/ComputeDistance';
import ComputeVAndDir from '@any-touch/compute/ComputeVAndDir';
import ComputeMaxLength from '@any-touch/compute/ComputeMaxLength';
import recognizeForPressMoveLike from '@Recognizer/recognizeForPressMoveLike';
import isVaildDirection from '@Recognizer/isVaildDirection';
import Recognizer from '@any-touch/Recognizer';

export default class SwipeRecognizer extends Recognizer {
    static DEFAULT_OPTIONS = {
        name: 'swipe',
        threshold: 10,
        velocity: 0.3,
        pointLength: 1,
    };
    constructor(options = {}) {
        super(options);
    };

    /**
     * 识别条件
     * @param {AnyTouchEvent} 计算数据
     */
    test(input: Input): boolean {
        const { inputType } = input;
        // 非end阶段, 开始校验数据
        if (INPUT_END !== inputType) return false;
        const { velocityX, velocityY, maxPointLength, distance, direction } = this.computed;
        return this.options.pointLength === maxPointLength &&
            this.options.threshold < distance &&
            isVaildDirection(this, direction) &&
            this.options.velocity < Math.max(velocityX, velocityY);
    };
    /**
     * 开始识别
     * @param {Input} 输入 
     */
    recognize(input: Input, emit: (type: string, ...payload: any[]) => void) {
        type Computed = ReturnType<ComputeMaxLength['compute']> & ReturnType<ComputeVAndDir['compute']> &
            ReturnType<ComputeDistance['compute']>
        this.computed = <Computed>this.compute([ComputeMaxLength, ComputeVAndDir, ComputeDistance], input);
        recognizeForPressMoveLike(this, input, emit);
        // panleft...
        // emit(this.options.name + this.computed.direction, this.computed);
    };
};