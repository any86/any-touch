import { Computed } from '../interface';
import {
    STATUS_RECOGNIZED,
    STATUS_POSSIBLE,
    STATUS_FAILED
} from '../const/recognizerStatus';
const { setTimeout, clearTimeout } = window;
import Recognizer from './Base';
import { INPUT_END } from '../const';
export default class TapRecognizer extends Recognizer {
    tapCount: number;
    tapTimeoutId?: number;
    static DEFAULT_OPTIONS = {
        name: 'tap',
        pointer: 1,
        taps: 1,
        interval: 300,
        disabled: false
    };
    constructor(options = {}) {
        super(options);
        this.tapCount = 0;
    };

    getTouchAction() {
        // 单击auto, 多击manipulation=pan + pinch-zoom(禁用了默认双击)
        // console.log({taps: this.options.taps});
        return (1 < this.options.taps) ? ['manipulation'] : ['auto'];
    };

    /**
     * 识别后执行
     * @param {Computed} 计算数据 
     */
    public recognize(computed: Computed): void {
        this.status = STATUS_POSSIBLE;
        // this.cancel();
        const isValid = this.test(computed);
        if (isValid) {
            // 累加点击
            this.tapCount++;
            const isValidTapCount = this.options.taps === this.tapCount;
            if (this.hasRequireFailure()) {
                // 如果是需要其他手势失败才能触发的手势,
                // 需要等待(300ms)其他手势失败才能触发
                this.cancel();
                this.tapTimeoutId = setTimeout(() => {
                    if (isValidTapCount && this.isTheOtherFail()) {
                        this.status = STATUS_RECOGNIZED;
                        this.emit(this.options.name, { ...computed, tapCount: this.tapCount });
                    };
                    this.tapCount = 0;
                }, this.options.interval);
            } else {
                // 如果不需要等待其他手势失败
                // 那么立即执行
                this.cancel();
                if (isValidTapCount) {
                    this.emit(this.options.name, { ...computed, tapCount: this.tapCount });
                    this.tapCount = 0;
                }
                this.tapTimeoutId = setTimeout(() => {
                    this.status = STATUS_FAILED;
                    this.tapCount = 0;
                }, this.options.interval)
            }
        }
    };

    /**
     * 取消等待识别的
     */
    public cancel() {
        clearTimeout(this.tapTimeoutId);
    };

    /**
      * 识别条件
      * @param {Computed} 计算数据
      * @return {Boolean} 是否验证成功
      */
    public test(computed: Computed): boolean {
        const { abs, max } = Math;
        // 判断是否发生大的位置变化
        const { inputStatus, distance, duration, maxPointerLength, centerX, centerY, displacementX, displacementY } = computed;
        // 产生的位移
        const hasMove = 2 < max(displacementX, displacementY);
        return INPUT_END === inputStatus && 1 === maxPointerLength && 2 > distance && 250 > duration && !hasMove
    };

    afterEmit(computed: Computed): void { }
};