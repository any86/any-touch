import type { Computed, EventTrigger } from '@any-touch/shared';
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
        this.computeFunctions = [ComputeAngle];
    };

    /**
     * 识别条件
     * @param computed 计算数据
     * @return 接收是否识别状态
     */
    test(computed: Computed): boolean {
        const { pointLength, angle } = computed;
        return this.isValidPointLength(pointLength) && (this.options.threshold < Math.abs(angle) || this.isRecognized);
    };

    /**
     * 开始识别
     * @param computed 计算数据
     */
    recognize(computed: Computed, emit: EventTrigger) {
        recognizeForPressMoveLike(this, computed, emit);
    };

};