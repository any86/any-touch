import { RECOGNIZER_STATUS, Computed } from '@any-touch/shared';
import {
    STATUS_POSSIBLE,
    STATUS_START,
    STATUS_MOVE,
    STATUS_END,
    STATUS_CANCELLED,
    STATUS_FAILED,
} from '@any-touch/shared';
import { ComputeAngle, ComputeVectorForMutli } from '@any-touch/compute';
import { flow } from '@any-touch/recognizer';
import Core from '@any-touch/core';
const DEFAULT_OPTIONS = {
    name: 'rotate',
    // 触发事件所需要的最小角度
    threshold: 0,
    pointLength: 2,
};

/**
 * "旋转"识别器
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
        } if ([STATUS_END, STATUS_CANCELLED].includes(status)) {
            context.emit2(_options.name + status, computed);
        }
    });

    // 加载计算方法, 有前后顺序
    context.compute([ComputeVectorForMutli, ComputeAngle]);
    return { status };
}

function test(computed: Required<Computed>, options: typeof DEFAULT_OPTIONS, status: RECOGNIZER_STATUS) {
    let isRecognized = [STATUS_START, STATUS_MOVE].includes(status);
    const { pointLength, angle } = computed;
    return options.pointLength === pointLength && (options.threshold < Math.abs(angle) || isRecognized);
}

// class A extends Recognizer {
//     constructor(options: Partial<typeof DEFAULT_OPTIONS>) {
//         super({ ...DEFAULT_OPTIONS, ...options });
//         this.computeFunctions = [ComputeAngle];
//     };

//     /**
//      * 识别条件
//      * @param computed 计算数据
//      * @return 接收是否识别状态
//      */
//     _$test(computed: Computed): boolean {
//         const { pointLength, angle } = computed;
//         return this._$isValidPointLength(pointLength) && (this.options.threshold < Math.abs(angle) || this._$isRecognized);
//     };

//     /**
//      * 开始识别
//      * @param computed 计算数据
//      */
//     recognize(computed: Computed, emit: EventTrigger) {
//         recognizeForPressMoveLike(this, computed, emit);
//     };

// };
