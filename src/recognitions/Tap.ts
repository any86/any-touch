import { Computed, Point } from '../interface';
import {
    STATUS_RECOGNIZED, STATUS_POSSIBLE,
    STATUS_FAILED,
} from '../const/recognizerStatus';
const { setTimeout, clearTimeout } = window;
import Recognizer from './Base';
import { INPUT_END } from '../const';
import { getVLength } from '../vector';
export default class TapRecognizer extends Recognizer {
    public tapCount: number;


    // 记录每次单击完成时的坐标
    public prevTapPoint?: Point;
    public prevTapTime?: number;

    // 多次tap之间的距离是否满足要求
    public isValidDistanceFromPrevTap?: boolean;

    // timer
    private _delayFailTimer?: number;
    private _waitOtherFailedTimer?: number;

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
     * 校验2次tap的时间间隔是否满足
     * @return {Boolean} 是否满足
     */
    private _isValidInterval(): boolean {
        const now = Date.now();
        if (undefined === this.prevTapTime) {
            this.prevTapTime = now;
            return true;
        } else {
            const interval = now - this.prevTapTime;
            this.prevTapTime = now;
            return interval < this.options.waitNextTapTime;
        }
    };

    /**
     * 识别后执行, 流程如下:  
     *             开始   
     *              |
     *         <是否end阶段> - 否 - 结束
     *              |
     *          关闭定时器c1和c2
     *              |
     *          清除等待状态
     *              |
     *              是
     *              |
     *        重置状态为"可能是"
     *              |
     *        <是否满足单击条件> - 否 - 结束
     *              |
     *              是
     *              |
     *       <是否正确连击：是否上次点击信息为空 或 与上次点击的位移/时间是否满足约束> - 否 - 点击次数=1 - 继续(<是否到达点击数要求>)
     *              |
     *              是
     *              |
     *           点击次数+1
     *              |
     *       <是否到达点击数要求> - 否 - 设置定时器c1(t1毫秒后状态设置为"失败") - 结束
     *              |
     *              是
     *              |
     *      <是否需要其他手势失败> - 否 - 触发事件, 状态设置为"已识别",重置(点击次数,位置) - 结束
     *              |
     *              是
     *              |
     *           进入等待状态
     *              |
     *  <设置定时器c2(t1毫秒后检查"需要失败"的手势是否是"失败"状态, 重置(点击次数,位置, 等待状态)> - 否 - 设置状态为"失败" - 结束
     *              |
     *              是
     *              |
     *       触发, 状态设置为"已识别", 重置(点击次数,位置)
     *              |
     *             结束
     * 
     * @param {Computed} 计算数据 
     */
    public recognize(computed: Computed): void {
        // 只在end阶段去识别
        if (INPUT_END !== computed.eventType) return;

        this.status = STATUS_POSSIBLE;

        // 每一次点击是否符合要求
        if (this.test(computed)) {
            clearTimeout(this._delayFailTimer);
            clearTimeout(this._waitOtherFailedTimer);
            this.isWaitingOther = false;
            // 判断2次点击之间的距离是否过大
            // 对符合要求的点击进行累加
            if (this._isValidDistanceFromPrevTap(computed) && this._isValidInterval()) {
                this.tapCount++;
            } else {
                this.tapCount = 1;
            }
            // 是否满足点击次数要求
            // 之所以用%, 是因为如果连续点击3次, 单击的tapCount会为3, 但是其实tap也应该触发
            if (0 === this.tapCount % this.options.tapTimes) {
                if (this.hasRequireFailure() && !this.isAllRequireFailureRecognizersDisabled()) {
                    this.isWaitingOther = true;
                    this._waitOtherFailedTimer = setTimeout(() => {
                        // 检查指定手势是否识别为Failed
                        if (this.isAllRequiresFailedOrPossible()) {
                            this.status = STATUS_RECOGNIZED;
                            this.emit(this.options.name, { ...computed, tapCount: this.tapCount });
                        } else {
                            this.status = STATUS_FAILED;
                        };
                        this.isWaitingOther = false;
                        // 不论成功失败都要重置tap计数
                    }, this.options.waitNextTapTime);
                }
                // 如果不需要等待其他手势失败
                // 那么立即执行
                else {
                    this.status = STATUS_RECOGNIZED;
                    this.emit(this.options.name, { ...computed, tapCount: this.tapCount });
                    this.reset();
                }
            } else {
                this._delayFailTimer = setTimeout(() => {
                    this.status = STATUS_FAILED;
                    this.reset();
                }, this.options.waitNextTapTime);
            }
        } else {
            this.reset();
            this.status = STATUS_FAILED;
        }
    };

    public reset() {
        this.tapCount = 0;
        this.prevTapPoint = undefined;
        this.prevTapTime = undefined;
    };

    /**
      * 识别条件
      * @param {Computed} 计算数据
      * @return {Boolean} 是否验证成功
      */
    public test(computed: Computed): boolean {
        // 判断是否发生大的位置变化
        const { distance, deltaTime, maxPointLength } = computed;
        // 检查
        // 1. 触点数
        // 2. 移动距离
        // 3. start至end的事件, 区分tap和press
        return maxPointLength === this.options.pointLength &&
            this.options.positionTolerance >= distance &&
            this.options.maxPressTime > deltaTime;
    };

    public afterEmit(computed: Computed): void { }
};