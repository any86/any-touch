import { RECOGNIZER_STATE, Computed } from '@any-touch/shared';
import {
    STATE_POSSIBLE,
    STATE_START,
    STATE_MOVE,
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
    const _options = { ...DEFAULT_OPTIONS, ...options };
    const { name } = _options;
    const context = createPluginContext(name);
    at.on('computed', (computed) => {
        // 重置status
        resetState(context);

        // 禁止
        if (context.disabled) {
            context.state = STATE_POSSIBLE;
            return;
        };
        const isValid = test(computed, _options, context.state);
        context.state = flow(isValid, context.state, computed.phase);

        if (isValid) {
            at.emit2(name, computed, context);
            at.emit2(name + getStatusName(context.state), computed, context);
        }
    });

    // 加载计算方法
    at.compute([ComputeVAndDir, ComputeDistance, ComputeDeltaXY]);
    return context;
}

function test(computed: Computed, options: typeof DEFAULT_OPTIONS, state: RECOGNIZER_STATE) {

    const { pointLength, distance, direction, phase } = computed;

    return (
        ((isRecognized(state) || (distance && options.threshold <= distance)) &&
            options.pointLength === pointLength &&
            void 0 !== direction) ||
        (isRecognized(state) && TYPE_END === phase)
    );
}