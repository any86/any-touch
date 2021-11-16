import { RECOGNIZER_STATUS, Computed } from '@any-touch/shared';
import {
    STATUS_POSSIBLE,
    STATUS_START,
    STATUS_MOVE,
    STATUS_END,
    STATUS_CANCELLED,
    STATUS_FAILED,
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
    let status: RECOGNIZER_STATUS = STATUS_POSSIBLE;
    const _options = { ...options, ...DEFAULT_OPTIONS };

    context.on('computed', (computed) => {
        const { name } = _options;
        // 重置status
        if ([STATUS_END, STATUS_CANCELLED, STATUS_FAILED].includes(status)) {
            status = STATUS_POSSIBLE;
        }

        const isValid = test(computed, _options, status);
        status = flow(isValid, status, computed.phase);

        if (isValid) {
            context.emit2(name, computed);
            context.emit2(name + getStatusName(status), computed);
        }
    });

    // 加载计算方法
    context.compute([ComputeVAndDir, ComputeDistance, ComputeDeltaXY]);

    return () =>({ ..._options, status });
}

function test(computed: Computed, options: typeof DEFAULT_OPTIONS, status: RECOGNIZER_STATUS) {
    let isRecognized = ([STATUS_START, STATUS_MOVE] as Array<string | number>).includes(status);
    const { pointLength, distance, direction, phase } = computed;
    return (
        ((isRecognized || (distance && options.threshold <= distance)) &&
            options.pointLength === pointLength &&
            void 0 !== direction) ||
        (isRecognized && TYPE_END === phase)
    );
}