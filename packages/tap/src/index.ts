/**
 *           流程如下:
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
 */
import AnyTouch from 'any-touch';
import type { Point, PluginContext,AnyTouchEvent } from '@any-touch/shared';
import { STATE, TYPE_END, createPluginContext, isDisabled } from '@any-touch/shared';
import { getVLength } from '@any-touch/vector';
import { ComputeDistance, ComputeMaxLength } from '@any-touch/compute';
const DEFAULT_OPTIONS = {
    name: 'tap',
    // 触点数
    pointLength: 1,
    // 点击次数
    tapTimes: 1,
    // 等待下一次tap的时间,
    // 超过该事件就立即判断当前点击数量
    waitNextTapTime: 300,

    // 从接触到离开允许产生的最大距离
    maxDistance: 2,
    // 2次tap之间允许的最大位移
    maxDistanceFromPrevTap: 9,
    // 从接触到离开屏幕的最大时间
    maxPressTime: 250,
};

/**
 * 实例
 */
export type TapContext = PluginContext & typeof DEFAULT_OPTIONS;

/**
 * 扩展插件映射
 */
declare module '@any-touch/core' {
    interface PluginContextMap {
        tap: TapContext;
    }

    interface EventMap {
        tap: AnyTouchEvent;
    }
}

/**
 * "单击"识别器
 * @param at AnyTouch实例
 * @param options 识别器选项
 */
export default function (at: AnyTouch, options?: Partial<typeof DEFAULT_OPTIONS>): TapContext {
    const context = createPluginContext(DEFAULT_OPTIONS, options);

    let tapCount = 0;
    // 记录每次单击完成时的坐标
    let prevTapPoint: Point | undefined;
    let prevTapTime: number | undefined;
    let countDownToFailTimer: number;
    /**
     * 重置
     */
    function reset() {
        tapCount = 0;
        prevTapPoint = void 0;
        prevTapTime = void 0;
    }

    /**
     * 指定时间后, 状态变为"失败"
     */
    function countDownToFail() {
        countDownToFailTimer = (setTimeout as Window['setTimeout'])(() => {
            context.state = STATE.FAILED;
            reset();
        }, context.waitNextTapTime);
    }

    /**
     * 判断前后2次点击的距离是否超过阈值
     * @param center 当前触点中心坐标
     * @param options 选项
     * @param prevTapPoint 上一个点击的坐标
     * @return 前后2次点击的距离是否超过阈值
     */
    function isValidDistanceFromPrevTap(center: Point, options: typeof DEFAULT_OPTIONS) {
        // 判断2次点击的距离
        if (void 0 !== prevTapPoint) {
            const distanceFromPreviousTap = getVLength({ x: center.x - prevTapPoint.x, y: center.y - prevTapPoint.y });
            // 缓存当前点, 作为下次点击的上一点
            prevTapPoint = center;
            return options.maxDistanceFromPrevTap >= distanceFromPreviousTap;
        } else {
            prevTapPoint = center;
            return true;
        }
    }

    /**
     * 校验2次tap的时间间隔是否满足条件
     * @param waitNextTapTime 最大允许的间隔时间
     * @param prevTapTime 上一次点击的时间
     * @returns 2次tap的时间间隔是否满足条件
     */
    function isValidInterval(waitNextTapTime: number) {
        const now = performance.now();
        if (void 0 === prevTapTime) {
            prevTapTime = now;
            return true;
        } else {
            const interval = now - prevTapTime;
            prevTapTime = now;
            return interval < waitNextTapTime;
        }
    }
    at.compute([ComputeDistance, ComputeMaxLength], (computed) => {
        // 禁止
        if (isDisabled(context)) return;
        const { phase, x, y } = computed;

        // 只在end阶段去识别
        if (TYPE_END !== phase) return;
        context.state = STATE.POSSIBLE;
        // 每一次点击是否符合要求

        if (test()) {
            clearTimeout(countDownToFailTimer);
            // 判断2次点击之间的距离是否过大
            // 对符合要求的点击进行累加
            if (isValidDistanceFromPrevTap({ x, y }, context) && isValidInterval(context.waitNextTapTime)) {
                tapCount++;
            } else {
                tapCount = 1;
            }
            // 是否满足点击次数要求
            // 之所以用%, 是因为如果连续点击3次, 单击的tapCount会为3, 但是其实tap也应该触发
            if (0 === tapCount % context.tapTimes) {
                context.state = STATE.RECOGNIZED;
                // 触发事件
                at.emit2(context.name, computed, context);
                reset();
            } else {
                countDownToFail();
            }
        } else {
            reset();
            context.state = STATE.FAILED;
        }

        // 是否满足条件
        function test() {
            const { startInput, pointLength, timestamp } = computed;
            const deltaTime = timestamp - startInput.timestamp;
            // 1. 触点数
            // 2. 当前点击数为0, 也就是当所有触点离开才通过
            // 3. 移动距离
            // 4. start至end的事件, 区分tap和press
            const { distance, maxPointLength } = computed;
            return (
                maxPointLength === context.pointLength &&
                0 === pointLength &&
                context.maxDistance >= distance &&
                context.maxPressTime > deltaTime
            );
        }
    });

    return context;
}
