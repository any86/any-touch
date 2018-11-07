import { Computed } from '../interface';
interface Options { name: string, pointer: number, taps: number };
const { setTimeout, clearTimeout } = window;
import Recognizer from './Base';
export default class TapRecognizer extends Recognizer {
    tapCount: number;
    tapTimeoutId: number;
    // 上一次tap的点击坐标
    private _prevX: number;
    private _prevY: number;
    public options: Options;

    constructor(options: Options) {
        super(options);
        this.tapTimeoutId = null;
        this.tapCount = 0;
    };

    /**
     * 识别后执行
     * @param {Computed} 计算数据 
     */
    public recognize(computed: Computed): void {
        if (this.test(computed)) {
            // 累加点击
            this.tapCount++;
            if (this.hasRequireFailure()) {

                // 如果是需要其他手势失败才能触发的手势,
                // 需要等待(300ms)其他手势失败才能触发
                clearTimeout(this.tapTimeoutId);
                this.tapTimeoutId = setTimeout(() => {
                    // console.log(this.isOtherFailOrWait());
                    if (this.options.taps === this.tapCount && this.isTheOtherFail()) {
                        this.emit(this.options.name, { ...computed, tapCount: this.tapCount });
                    }
                    this.tapCount = 0;
                }, 300);
            } else {
                // 如果不需要等待其他手势失败
                // 那么立即执行
                clearTimeout(this.tapTimeoutId);
                if (this.options.taps === this.tapCount) {
                    this.emit(this.options.name, { ...computed, tapCount: this.tapCount });
                    this.tapCount = 0;
                }
                this.tapTimeoutId = setTimeout(() => {
                    this.status = 'failed';
                    this.tapCount = 0;
                }, 300)
            }
        }
    };
    /**
      * 识别条件
      * @param {Computed} 计算数据
      * @return {Boolean} 是否验证成功
      */
    public test(computed: Computed): boolean {
        const { abs, max } = Math;
        // 判断是否发生大的位置变化
        const { inputStatus, distance, duration, maxPointerLength, centerX, centerY } = computed;
        this._prevX = centerX;
        this._prevY = centerY;
        // 产生的位移
        let offsetX = abs(centerX - this._prevX);
        let offsetY = abs(centerY - this._prevY);
        const hasMove = 2 < max(offsetX, offsetY);
        return 'end' === inputStatus && 1 === maxPointerLength && 2 > distance && 250 > duration && !hasMove
    };
};