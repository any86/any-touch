import { Input, CommonEmitFunction } from '@types';
import { NONE, INPUT_END } from '@any-touch/const';
import ComputeVectorForMutli from '@any-touch/compute/ComputeVectorForMutli';
import computeAngle from '@any-touch/compute/computeAngle';
import recognizeForPressMoveLike from '@any-touch/Recognizer/recognizeForPressMoveLike';
import Recognizer from '@any-touch/Recognizer';


export default class PinchRecognizer extends Recognizer {
    static DEFAULT_OPTIONS = {
        name: 'rotate',
        // 触发事件所需要的最小角度
        threshold: 0,
        pointLength: 2,
    };
    constructor(options = {}) {
        super(options);
    };

    /**
     * 识别条件
     * @param {AnyTouchEvent} 计算数据
     * @return {Boolean} 接收是否识别状态
     */
    test(input:Input): boolean {
        const { pointLength } = input;
        const { angle } = this.computed;
        return this.isValidPointLength(pointLength) && (this.options.threshold < Math.abs(angle) || this.isRecognized);
    };

        /**
     * 开始识别
     * @param {InputRecord} 输入 
     */
    recognize(input: Input, emit: CommonEmitFunction) {
        type Computed = ReturnType<ComputeVectorForMutli['compute']> & {};
        const computed = <Computed>this.compute([ComputeVectorForMutli], input);
        if (`activeV` in computed) {
            // const {activeV, prevV,startV} = computed;
            this.computed = {...this.computed, ...computeAngle(computed)};
        }
        // console.log(this.computed);
        recognizeForPressMoveLike(this, input, emit);
    };

};