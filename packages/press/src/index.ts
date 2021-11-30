import {
    createPluginContext, resetState, STATE, isDisabled, DIRECTION_UP, TYPE_CANCEL, TYPE_END, TYPE_START
} from '@any-touch/shared';
import { ComputeDistance } from '@any-touch/compute';
import Core from '@any-touch/core';

const DEFAULT_OPTIONS = {
    name: 'press',
    pointLength: 1,
    maxDistance: 9,
    minPressTime: 251,
};
/**
 * "拖拽"识别器
 * @param at AnyTouch实例
 * @param options AnyTouch选项
 * @returns  
 */
export default function (at: Core, options?: Partial<typeof DEFAULT_OPTIONS>) {
    const context = createPluginContext(DEFAULT_OPTIONS, options);

    let timeoutId = 0;


    // 加载计算方法
    at.compute([ComputeDistance], (computed) => {
        // 禁止
        if (isDisabled(context)) return;
        const { phase, startInput, pointLength } = computed;
        // 1. start阶段
        // 2. 触点数符合
        // 那么等待minPressTime时间后触发press
        if (TYPE_START === phase && context.pointLength === pointLength) {
            // 重置状态
            resetState(context);

            // 延迟触发
            clearTimeout(timeoutId)
            timeoutId = (setTimeout as Window['setTimeout'])(() => {
                context.state = STATE.RECOGNIZED;
                at.emit2(context.name, computed, context);
            }, context.minPressTime);
        }
        // 触发pressup条件:
        // 1. end阶段
        // 2. 已识别
        else if (TYPE_END === phase && STATE.RECOGNIZED === context.state) {
            at.emit2(`${context.name}${DIRECTION_UP}`, computed, context);
        }
        else if (STATE.RECOGNIZED !== context.state) {
            const deltaTime = computed.timestamp - startInput.timestamp;
            // 一旦不满足必要条件,
            // 发生了大的位移变化
            if (!test() ||
                // end 或 cancel触发的时候还不到要求的press触发时间
                (context.minPressTime > deltaTime && [TYPE_END, TYPE_CANCEL].includes(phase))) {
                clearTimeout(timeoutId)
                context.state = STATE.FAILED;
            }
        }

        /**
         * 是否满足:
         * 移动距离不大
         */
        function test() {
            const { distance } = computed;
            return distance && context.maxDistance > distance;
        };
    });
    return context;
}