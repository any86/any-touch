import { Input, CommonEmitFunction } from '@any-touch/shared';
import { INPUT_MOVE, INPUT_END } from '@any-touch/shared';
import { ComputeDistance, ComputeDeltaXY, ComputeVAndDir } from '@any-touch/compute';
import Recognizer, { recognizeForPressMoveLike } from '@any-touch/recognizer';

export default class extends Recognizer {
    static DEFAULT_OPTIONS = {
        name: 'pan',
        threshold: 10,
        pointLength: 1
    };

    constructor(options = {}) {
        super(options);
    }

    /**
     * @param {AnyTouchEvent} 计算数据
     * @return {Boolean}} .是否是当前手势
     */
    test(input: Input): boolean {
        const { inputType, pointLength } = input;

        const { distance } = this.computed;
        return (
            INPUT_MOVE === inputType &&
            (this.isRecognized || this.options.threshold < distance) &&
            this.isValidPointLength(pointLength)
        );
    }

    /**
     * 开始识别
     * @param {Input} 输入
     */
    recognize(input: Input, emit: CommonEmitFunction): void {
        type Computed = ReturnType<ComputeVAndDir['compute']> &
            ReturnType<ComputeDistance['compute']> &
            ReturnType<ComputeDeltaXY['compute']>;

        this.computed = <Computed>this.compute([ComputeVAndDir, ComputeDistance, ComputeDeltaXY], input);
        const isRecognized = recognizeForPressMoveLike(this, input, emit);
        // panleft/panup/panright/pandown
        if (isRecognized) {
            const { inputType } = input;
            if (INPUT_END !== inputType) {
                emit(this.options.name + this.computed.direction, this.computed);
            }
        }
    }
}
