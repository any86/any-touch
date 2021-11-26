import type { PluginContext, Computed } from '@any-touch/shared';
import {
    isDisabled,
    resetState,
    TYPE_END, flow, getStatusName, createPluginContext, isRecognized
} from '@any-touch/shared';
import { ComputeDistance, ComputeDeltaXY, ComputeVAndDir } from '@any-touch/compute';
import Core from '@any-touch/core';

const DEFAULT_OPTIONS = { name: 'pan', threshold: 10, pointLength: 1 };
/**
 * "拖拽"识别器
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

        if (isValid) {
            const { name } = context;
            at.emit2(name, computed, context);
            at.emit2(name + getStatusName(context.state), computed, context);
        }
    });

    // 加载计算方法
    at.compute([ComputeVAndDir, ComputeDistance, ComputeDeltaXY]);
    return context;
}

function test(computed: Computed, context: PluginContext<typeof DEFAULT_OPTIONS>) {
    const { pointLength, distance, direction, phase } = computed;
    const { state } = context;
    return (
        ((isRecognized(state) || (distance && context.threshold <= distance)) &&
            context.pointLength === pointLength &&
            void 0 !== direction) ||
        (isRecognized(state) && TYPE_END === phase)
    );
}