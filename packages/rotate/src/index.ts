import type { Input, Computed, CommonEmitFunction } from '@any-touch/shared';
import { ComputeAngle } from '@any-touch/compute';
import Recognizer, { recognizeForPressMoveLike } from '@any-touch/recognizer';

const DEFAULT_OPTIONS = {
    name: 'rotate',
    // 触发事件所需要的最小角度
    threshold: 0,
    pointLength: 2,
};
export default class extends Recognizer {
    constructor(options: Partial<typeof DEFAULT_OPTIONS>) {
        super({ ...DEFAULT_OPTIONS, ...options });
        // this.computeFunctions = [ComputeAngle, ComputeVectorForMutli];
        this.computeFunctions = [ComputeAngle];
    };

    /**
     * 识别条件
     * @param {AnyTouchEvent} 计算数据
     * @return {Boolean} 接收是否识别状态
     */
    test(computed: Computed): boolean {
        const { pointLength, angle } = computed;
        return this.isValidPointLength(pointLength) && (this.options.threshold < Math.abs(angle) || this.isRecognized);
    };

    /**
 * 开始识别
 * @param {Input} 输入 
 */
    recognize(computed: Computed, emit: CommonEmitFunction) {
        // const computed = this.compute([ComputeVectorForMutli], input);
        // if (`activeV` in computed) {
        //     // const {activeV, prevV,startV} = computed;
        //     this.computed = { ...this.computed, ...computeAngle(computed) };
        // }
        // console.log(this.computed);
        recognizeForPressMoveLike(this, computed, emit);
    };

};