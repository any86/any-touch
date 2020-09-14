import type { Computed, EventTrigger } from '@any-touch/shared';
import { ComputeScale } from '@any-touch/compute';
import Recognizer, { recognizeForPressMoveLike } from '@any-touch/recognizer';
const DEFAULT_OPTIONS = {
    name: 'pinch',
    // 触发事件所需要的最小缩放比例
    threshold: 0,
    pointLength: 2,
};

export default class extends Recognizer {
    constructor(options: Partial<typeof DEFAULT_OPTIONS>) {
        super({ ...DEFAULT_OPTIONS, ...options });
        this.computeFunctions = [ComputeScale];
    };

    /**
     * 识别条件
     * @param computed 计算数据
     * @param 是否符合
     */
    test(computed: Computed): boolean {
        const { pointLength, scale } = computed;
        return this.isValidPointLength(pointLength)
            && void 0 !== scale
            && (this.options.threshold < Math.abs(scale - 1) || this.isRecognized);
    };

    /**
     * 开始识别
     * @param computed 计算结果 
     */
    recognize(computed: Computed, emit: EventTrigger) {
        // const computed = this.compute([ComputeVectorForMutli], input);
        // if (`activeV` in computed) {
        //     // const {activeV, prevV,startV} = computed;
        //     this.computed = { ...this.computed, ...computeScale(computed) };
        // }
        // console.log(this.computed);
        recognizeForPressMoveLike(this, computed, emit);
    };
};