import { RECOGNIZER_STATE, Computed } from '@any-touch/shared';
import {
    STATE_POSSIBLE,
    STATE_START,
    STATE_MOVE,
    STATE_END,
    STATE_CANCELLED,
    STATE_FAILED, flow, getStatusName, createPluginContext
} from '@any-touch/shared';
import { ComputeAngle, ComputeVectorForMutli } from '@any-touch/compute';
import Core from '@any-touch/core';
const DEFAULT_OPTIONS = {
    name: 'rotate',
    // 触发事件所需要的最小角度
    threshold: 0,
    pointLength: 2,
};

/**
 * "旋转"识别器
 * @param at AnyTouch实例
 * @param options 识别器选项
 * @returns
 */
export default function (at: Core, options?: Partial<typeof DEFAULT_OPTIONS>) {
    const _options = { ...options, ...DEFAULT_OPTIONS };
    const {name} = _options;
    const context = createPluginContext(name);

    at.on('computed', (computed) => {
        // 禁止
        if (context.disabled) {
            context.state = STATE_POSSIBLE;
            return;
        };

        // 重置status
        if ([STATE_END, STATE_CANCELLED, STATE_FAILED].includes(context.state)) {
            context.state = STATE_POSSIBLE;
        }

        const isValid = test(computed, _options, context.state);
        context.state = flow(isValid, context.state, computed.phase);

        if (isValid) {
            at.emit2(_options.name, computed);
            at.emit2(_options.name + getStatusName(context.state), computed);
            // context.emit2(_options.name + computed.direction, computed);
        } if ([STATE_END, STATE_CANCELLED].includes(context.state)) {
            at.emit2(_options.name + getStatusName(context.state), computed);
        }
    });

    // 加载计算方法, 有前后顺序
    at.compute([ComputeVectorForMutli, ComputeAngle]);
    return context;
}

function test(computed: Required<Computed>, options: typeof DEFAULT_OPTIONS, state: RECOGNIZER_STATE) {
    let isRecognized = [STATE_START, STATE_MOVE].includes(state);
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
