import { Computed, PluginContext } from '@any-touch/shared';
import {
    STATE,
    isDisabled, flow, getStatusName, resetState, isRecognized, createPluginContext
} from '@any-touch/shared';
import { ComputeScale, ComputeVectorForMutli } from '@any-touch/compute';
import Core from '@any-touch/core';

const DEFAULT_OPTIONS = {
    name: 'pinch',
    // 触发事件所需要的最小缩放比例
    threshold: 0,
    pointLength: 2,
};
/**
 * "啮合"识别器
 * @param at AnyTouch实例
 * @param options 识别器选项
 * @returns
 */
export default function (at: Core, options?: Partial<typeof DEFAULT_OPTIONS>) {
    const context = createPluginContext(DEFAULT_OPTIONS, options);
    at.on('computed', (computed) => {
        // 重置status
        resetState(context);

        // 禁止
        if (isDisabled(context)) return;
        const isValid = test(computed, context);

        context.state = flow(isValid, context.state, computed.phase);
        const { name } = context;
        if (isValid) {
            at.emit2(name, computed, context);
            at.emit2(name + getStatusName(context.state), computed, context);
        }
        else if ([STATE.END, STATE.CANCELLED].includes(context.state)) {
            at.emit2(name + getStatusName(context.state), computed, context);
        }
    });

    // 加载计算方法, 有前后顺序
    at.compute([ComputeVectorForMutli, ComputeScale]);

    return context;
}

function test(computed: Computed, context: PluginContext<typeof DEFAULT_OPTIONS>) {
    const { pointLength, scale, deltaScale } = computed;
    return (context.pointLength === pointLength && (void 0 !== scale && void 0 !== deltaScale && context.threshold < Math.abs(scale - 1) || isRecognized(context.state)))
}