import { Input, CommonEmitFunction } from '@any-touch/shared';
import { INPUT_END } from '@any-touch/shared';
import {ComputeDistance,ComputeVAndDir,ComputeMaxLength} from '@any-touch/compute';
import Recognizer from '@any-touch/recognizer';

export default class extends Recognizer {
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
            this.options.velocity < Math.max(velocityX, velocityY);
    };
    /**
     * 开始识别
     * @param {Input} 输入 
     */
    recognize(input: Input, emit: CommonEmitFunction) {
        type Computed = ReturnType<ComputeMaxLength['compute']> & ReturnType<ComputeVAndDir['compute']> &
            ReturnType<ComputeDistance['compute']>
        this.computed = <Computed>this.compute([ComputeMaxLength, ComputeVAndDir, ComputeDistance], input);
        if (this.test(input)) {
            emit(this.options.name, this.computed);
            // swipeleft...
            emit(this.options.name + this.computed.direction, this.computed);
        }

    };
};