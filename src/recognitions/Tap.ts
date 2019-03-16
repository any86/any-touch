import { Computed, Point } from '../interface';
import {
    STATUS_RECOGNIZED,
    STATUS_FAILED,
    STATUS_START,
} from '../const/recognizerStatus';
const { setTimeout, clearTimeout } = window;
import Recognizer from './Base';
import { INPUT_END } from '../const';
import { getVLength } from '../vector';
export default class TapRecognizer extends Recognizer {
    public tapCount: number;
    public tapTimeoutId?: number;
    public tapTimeout2Id?: number;

    // 记录每次单击完成时的坐标
    public prevTapPoint?: Point;
    // 多次tap之间的距离是否满足要求
    public isValidDistanceFromPrevTap?: boolean;

    static DEFAULT_OPTIONS = {
        name: 'tap',
        pointLength: 1,
        tapTimes: 1,
        // 等待下一次tap的时间, 
        // 超过该事件就立即判断当前点击数量
        waitNextTapTime: 300,
        disabled: false,
        // 从接触到离开允许产生的最大距离
        positionTolerance: 2,
        // 2次tap之间允许的最大位移
        tapsPositionTolerance: 9,
        // 从接触到离开屏幕的最大时间
        maxPressTime: 250,
    };
    constructor(options = {}) {
        super(options);
        this.tapCount = 0;
    };

    public getTouchAction() {
        // 单击auto, 多击manipulation=pan + pinch-zoom(禁用了默认双击)
        return (1 < this.options.tapTimes) ? ['manipulation'] : ['auto'];
    };

    /**
     * 判断前后2次点击的距离是否超过阈值
     * @param {Point} 当前触点
     * @return {Boolean} 前后2次点击的距离是否超过阈值
     */
    private _isValidDistanceFromPrevTap(point: Point): boolean {
        // 判断2次点击的距离
        if (undefined !== this.prevTapPoint) {
            const distanceFromPreviousTap = getVLength({ x: point.x - this.prevTapPoint.x, y: point.y - this.prevTapPoint.y });
            // 缓存当前点, 作为下次点击的上一点
            this.prevTapPoint = point;
            return this.options.tapsPositionTolerance >= distanceFromPreviousTap;
        } else {
            this.prevTapPoint = point;
            return true;
        }
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
        // 判断2次点击之间的距离是否过大
        const { x, y } = computed;

        // 每一次点击是否符合要求
        if (this.test(computed)) {
            // 取消当前识别
            clearTimeout(this.tapTimeout2Id);
            // 对符合要求的点击进行累加
            if (this._isValidDistanceFromPrevTap({ x, y })) {
                this.tapCount++;
            }

            // 是否满足点击次数要求
            if (this.options.tapTimes === this.tapCount) {
                // 仅仅为了不让状态为possible和failed
                // 这样isTheOtherFailed才不会错误的触发其他还没有符合条件的tap
                // 因为isTheOtherFailed方法会监测possible和failed俩种状态
                // 这里的STATUS_START可以想成在等待failture前的等待状态

                this.status = STATUS_START;
                // 如果需要其他手势失败
                // 等待(300ms)其他手势失败后触发
                if (this.hasRequireFailure()) {
                    this.tapTimeoutId = setTimeout(() => {
                        // 检查指定手势是否识别为Failed
                        if (this.isTheOtherFailed()) {
                            this.status = STATUS_RECOGNIZED;
                            this.emit(this.options.name, { ...computed, tapCount: this.tapCount });
                        } else {
                            this.status = STATUS_FAILED;
                        };
                        // 不论成功失败都要重置tap计数
                        this.reset();
                    }, this.options.waitNextTapTime);
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
            // 慢慢的点击n次, 会触发tapN事件
            else {
                // 取消等待failture,
                // 因为已经不符合了tapTimes的限制
                this.tapTimeout2Id = setTimeout(() => {
                    this.reset();
                }, this.options.waitNextTapTime);
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
        this.prevTapPoint = undefined;
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
            this.options.positionTolerance >= distance &&
            this.options.maxPressTime > deltaTime;
    };

    public afterEmit(computed: Computed): void { }
};