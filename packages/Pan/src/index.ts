import { Input, CommonEmitFunction } from '@any-touch/shared/types';
import { INPUT_MOVE, INPUT_END } from '@any-touch/shared/const';
import Recognizer from '@any-touch/recognizer';
import ComputeDistance from '@any-touch/compute/ComputeDistance';
import ComputeDeltaXY from '@any-touch/compute/ComputeDeltaXY';
import ComputeVAndDir from '@any-touch/compute/ComputeVAndDir';
import recognizeForPressMoveLike from '@any-touch/recognizer/recognizeForPressMoveLike';

export default class PanRecognizer extends Recognizer {
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
        recognizeForPressMoveLike(this, input, emit);
        // panleft/panup/panright/pandown
        const { inputType } = input;
        if (INPUT_END !== inputType) {
            emit(this.options.name + this.computed.direction, this.computed);
        }
    }
}
