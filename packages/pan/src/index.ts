import { RECOGNIZER_STATUS, Computed, Input } from '@any-touch/shared';
import {
    STATUS_POSSIBLE,
    STATUS_START,
    STATUS_MOVE,
    STATUS_END,
    STATUS_CANCELLED,
    STATUS_FAILED,
} from '@any-touch/shared';
import { ComputeDistance, ComputeDeltaXY, ComputeVAndDir } from '@any-touch/compute';
import { flow } from '@any-touch/recognizer';
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
    context.on('computed', (computed) => {
        const _options = { ...options, ...DEFAULT_OPTIONS };
        // 重置status
        if ([STATUS_END, STATUS_CANCELLED, STATUS_FAILED].includes(status)) {
            status = STATUS_POSSIBLE;
        }

        const isValid = test(computed, _options, status);
        status = flow(isValid, status, computed.phase);

        if (isValid) {
            context.emit2(_options.name, computed);
            context.emit2(_options.name + status, computed);
            context.emit2(_options.name + computed.direction, computed);
            context.emit2('at', computed);
            context.emit2('at:after', { ...computed, name: _options.name });
        }
    });

    // 加载计算方法
    context.compute([ComputeVAndDir, ComputeDistance, ComputeDeltaXY]);

    return { status }
}

function test(computed: Computed, options: typeof DEFAULT_OPTIONS, status: RECOGNIZER_STATUS) {
    let isRecognized = [STATUS_START, STATUS_MOVE].includes(status);
    const { pointLength, distance, direction, phase } = computed;
    return (
        ((isRecognized || (distance && options.threshold <= distance)) &&
            options.pointLength === pointLength &&
            void 0 !== direction) ||
        (isRecognized && 'end' === phase)
    );
}
