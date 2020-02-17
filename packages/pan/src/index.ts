import { Input, CommonEmitFunction } from '@any-touch/shared';
import { ComputeDistance, ComputeDeltaXY, ComputeVAndDir } from '@any-touch/compute';
import Recognizer, { recognizeForPressMoveLike } from '@any-touch/recognizer';
const DEFAULT_OPTIONS = {
    name: 'pan',
    threshold: 10,
    pointLength: 1
};
export default class extends Recognizer {
    constructor(options: Partial<typeof DEFAULT_OPTIONS>) {
        super({ ...DEFAULT_OPTIONS, ...options });
    }

    /**
     * 必要条件
     * @param input 计算数据
     * @return 是否是当前手势
     */
    test(input: Input): boolean {
        const {pointLength } = input;

        const { distance } = this.computed;
        return (
            // INPUT_MOVE === inputType &&
            (this.isRecognized || this.options.threshold < distance) &&
            this.isValidPointLength(pointLength)
        );
    }

    /**
     * 开始识别
     * @param input 输入
     * @param emit 触发事件函数
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
            // if (INPUT_END !== inputType) {
                emit(this.options.name + this.computed.direction, this.computed);
            // }
        }
    }
}
