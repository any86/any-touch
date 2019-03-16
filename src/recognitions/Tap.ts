import { Computed } from '../interface';
import {
    STATUS_RECOGNIZED,
    STATUS_POSSIBLE,
    STATUS_FAILED,
    STATUS_START,
    STATUS_CANCELLED
} from '../const/recognizerStatus';
const { setTimeout, clearTimeout } = window;
import Recognizer from './Base';
import { INPUT_END, INPUT_START } from '../const';
export default class TapRecognizer extends Recognizer {
    tapCount: number;
    tapTimeoutId?: number;
    tapTimeout2Id?: number;

    // 记录每次单击完成时的坐标
    prevTapX?: number;
    prevTapY?: number;
    // 多次tap之间的距离是否满足要求
    isValidMovementFromPrevTap?: boolean;
    static DEFAULT_OPTIONS = {
        name: 'tap',
        pointLength: 1,
        tapTimes: 1,
        // 每次询问failture的时间间隔
        interval: 300,
        disabled: false,
        tolerance: 2,
        maxPressTime: 250,
    };
    constructor(options = {}) {
        super(options);
        this.tapCount = 0;
    };

    getTouchAction() {
        // 单击auto, 多击manipulation=pan + pinch-zoom(禁用了默认双击)
        // console.log({taps: this.options.tapTimes});
        return (1 < this.options.tapTimes) ? ['manipulation'] : ['auto'];
    };

    /**
     * 识别后执行
     * @param {Computed} 计算数据 
     */
    public recognize(computed: Computed): void {
        // 只在end阶段去识别
        if (INPUT_END !== computed.eventType) return;

        // 如果识别结束, 那么重置状态
        this._resetStatus();

        // 每一次点击是否符合要求
        const isValidEachTap = this.test(computed);

        // 判断2次点击之间的距离是否过大
        const { max, pow, sqrt } = Math;
        const { x, y } = computed;
        if (undefined === this.prevTapX || undefined === this.prevTapY) {
            this.isValidMovementFromPrevTap = true;
        } else {
            this.isValidMovementFromPrevTap = 10 > sqrt(max(pow(x - this.prevTapX, 2), pow(y - this.prevTapY, 2)));
        }
        this.prevTapX = x;
        this.prevTapY = y;
        // console.log(this.name, this.options.tapTimes, this.isValidMovementFromPrevTap);

        if (isValidEachTap) {
            // 取消当前识别
            clearTimeout(this.tapTimeout2Id);
            // 对符合要求的点击进行累加
            if (this.isValidMovementFromPrevTap) {
                this.tapCount++;
            }
            // 是否满足点击次数要求
            if (this.options.tapTimes === this.tapCount) {
                this.status = STATUS_START;
                // 如果需要其他手势失败
                // 等待(300ms)其他手势失败后触发
                if (this.hasRequireFailure()) {
                    this.tapTimeoutId = setTimeout(() => {
                        // 检查指定手势是否识别为Fail
                        if (this.isTheOtherFail()) {
                            this.status = STATUS_RECOGNIZED;
                            this.emit(this.options.name, { ...computed, tapCount: this.tapCount });
                        } else {
                            this.status = STATUS_FAILED;
                        };
                        // 不论成功失败都要重置tap计数
                        this.reset();
                    }, this.options.interval);
                }
                // 如果不需要等待其他手势失败
                // 那么立即执行
                else {
                    this.status = STATUS_RECOGNIZED;
                    this.emit(this.options.name, { ...computed, tapCount: this.tapCount });
                    this.reset();
                }
            }
            // 不满足次数要求(过多或者过少), 
            // 间隔时间后都要重置计数,
            // 不然会出现如下:
            // 慢慢的点击n次, 会触发nTap
            else {
                this.tapTimeout2Id = setTimeout(() => {
                    this.reset();
                }, this.options.interval)
            }
        } else {
            // if (this.options.tapTimes !== this.tapCount) {
            //     clearTimeout(this.tapTimeoutId);
            // }
            this.reset();
            this.status = STATUS_FAILED;
        }
    };

    public reset() {
        this.tapCount = 0;
        this.prevTapX = undefined;
        this.prevTapY = undefined;
    }

    /**
      * 识别条件
      * @param {Computed} 计算数据
      * @return {Boolean} 是否验证成功
      */
    public test(computed: Computed): boolean {
        // 判断是否发生大的位置变化
        const { distance, deltaTime, maxpointLength } = computed;
        // 检查
        // 1. 触点数
        // 2. 移动距离
        // 3. start至end的事件, 区分tap和press
        return maxpointLength === this.options.pointLength &&
            this.options.tolerance >= distance && this.options.maxPressTime > deltaTime;
    };

    public afterEmit(computed: Computed): void { }
};