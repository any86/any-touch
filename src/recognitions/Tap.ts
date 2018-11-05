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
    public afterRecognized(computed: Computed) {

    };

    /**
     * 识别条件
     * @param {Computed} 计算数据
     * @param {(isRecognized: boolean) => void}} 接收是否识别状态
     */
    public test(computed: Computed, callback: (isRecognized: boolean) => void): void {
        const { abs, max } = Math;
        // 判断是否发生大的位置变化
        const { inputStatus, distance, duration, maxPointerLength, centerX, centerY } = computed;
        this._prevX = centerX;
        this._prevY = centerY;
        // 产生的位移
        let offsetX = abs(centerX - this._prevX);
        let offsetY = abs(centerY - this._prevY);
        const hasMove = 2 < max(offsetX, offsetY);
        if ('end' === inputStatus && 1 === maxPointerLength && 2 > distance && 250 > duration && !hasMove) {
            // 累加点击
            this.tapCount++;
            if (this.hasRequireFailure()) {
                // 如果是需要其他手势失败才能触发的手势,
                // 需要等待(300ms)其他手势失败才能触发
                clearTimeout(this.tapTimeoutId);
                this.tapTimeoutId = setTimeout(() => {
                    if (this.options.taps === this.tapCount && this.isTheOtherFail()) {
                        callback(true);
                        callback(false);
                    } else {
                        callback(false);
                        clearTimeout(this.tapTimeoutId);
                    }
                    this.tapCount = 0;
                }, 300);
            } else {
                // 如果不需要等待其他手势失败
                // 那么立即执行
                clearTimeout(this.tapTimeoutId);
                if (this.options.taps === this.tapCount) {
                    callback(true);
                    this.tapCount = 0;
                }

                // 300ms后如何没有点击, 那么tapCount复位
                this.tapTimeoutId = setTimeout(() => {
                    callback(false);
                    this.tapCount = 0;
                }, 300);
            }
        }
    };
};