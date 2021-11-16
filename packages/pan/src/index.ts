import { RECOGNIZER_STATE, Computed } from '@any-touch/shared';
import {
    STATE_POSSIBLE,
    STATE_START,
    STATE_MOVE,
    STATE_END,
    STATE_CANCELLED,
    STATE_FAILED,
    TYPE_END, flow, getStatusName
} from '@any-touch/shared';
import { ComputeDistance, ComputeDeltaXY, ComputeVAndDir } from '@any-touch/compute';
import Core from '@any-touch/core';

const DEFAULT_OPTIONS = { name: 'pan', threshold: 10, pointLength: 1 };
/**
 * "拖拽"识别器
 * @param context AnyTouch实例
 * @param options AnyTouch选项
 * @returns  
 */
export default function (context: Core, options?: Partial<typeof DEFAULT_OPTIONS>) {
    let state: RECOGNIZER_STATE = STATE_POSSIBLE;
    const _options = { ...options, ...DEFAULT_OPTIONS };

    context.on('computed', (computed) => {
        const { name } = _options;
        // 重置status
        if ([STATE_END, STATE_CANCELLED, STATE_FAILED].includes(state)) {
            state = STATE_POSSIBLE;
        }

        const isValid = test(computed, _options, state);
        state = flow(isValid, state, computed.phase);

        if (isValid) {
            context.emit2(name, computed);
            context.emit2(name + getStatusName(state), computed);
        }
    });

    // 加载计算方法
    context.compute([ComputeVAndDir, ComputeDistance, ComputeDeltaXY]);

    return () =>({ ..._options, state });
}

function test(computed: Computed, options: typeof DEFAULT_OPTIONS, state: RECOGNIZER_STATE) {
    let isRecognized = ([STATE_START, STATE_MOVE] as Array<string | number>).includes(state);
    const { pointLength, distance, direction, phase } = computed;
    return (
        ((isRecognized || (distance && options.threshold <= distance)) &&
            options.pointLength === pointLength &&
            void 0 !== direction) ||
        (isRecognized && TYPE_END === phase)
    );
}