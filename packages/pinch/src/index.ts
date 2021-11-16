import { RECOGNIZER_STATE, Computed, Input } from '@any-touch/shared';
import {
    STATE_POSSIBLE,
    STATE_END,
    STATE_CANCELLED,
    STATE_FAILED,flow,getStatusName
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
 * @param context AnyTouch实例
 * @param options AnyTouch选项
 * @returns
 */
export default function (context: Core, options?: Partial<typeof DEFAULT_OPTIONS>) {
    const _options = { ...options, ...DEFAULT_OPTIONS };
    let state: RECOGNIZER_STATE = STATE_POSSIBLE;

    context.on('computed', (computed) => {
        // 重置status
        if ([STATE_END, STATE_CANCELLED, STATE_FAILED].includes(state)) {
            state = STATE_POSSIBLE;
        }

        const isValid = test(computed, _options);
        state = flow(isValid, state, computed.phase);
        if (isValid) {
            context.emit2(_options.name, computed);
            context.emit2(_options.name + getStatusName(state), computed);
            // context.emit2('at', computed);
            // context.emit2('at:after', { ...computed, name: _options.name });
        } 
        else if ([STATE_END, STATE_CANCELLED].includes(state)) {
            context.emit2(_options.name + getStatusName(state), computed);
        }
    });

    // 加载计算方法, 有前后顺序
    context.compute([ComputeVectorForMutli, ComputeScale]);

    return () =>({ ..._options, state });
}

function test(computed: Computed, options: typeof DEFAULT_OPTIONS) {
    const { pointLength, scale,deltaScale } = computed;
    return (options.pointLength === pointLength && (void 0 !== scale && void 0 !== deltaScale && options.threshold < Math.abs(scale - 1)))
}

// class P extends Recognizer {
//     constructor(options: Partial<typeof DEFAULT_OPTIONS>) {
//         super({ ...DEFAULT_OPTIONS, ...options });
//         this.computeFunctions = [ComputeScale];
//     };

//     /**
//      * 识别条件
//      * @param computed 计算数据
//      * @param 是否符合
//      */
//     _$test(computed: Computed): boolean {
//         const { pointLength, scale } = computed;
//         return this._$isValidPointLength(pointLength)
//             && void 0 !== scale
//             && (this.options.threshold < Math.abs(scale - 1) || this._$isRecognized);
//     };

//     /**
//      * 开始识别
//      * @param computed 计算结果
//      */
//     recognize(computed: Computed, emit: EventTrigger) {
//         recognizeForPressMoveLike(this, computed, emit);
//     };
// };
