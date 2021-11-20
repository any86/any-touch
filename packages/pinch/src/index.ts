import { Computed,resetState,isRecognized, RECOGNIZER_STATE } from '@any-touch/shared';
import {
    STATE,
    isDisabled, flow, getStatusName, createPluginContext
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
    const _options = { ...DEFAULT_OPTIONS , ...options};
    const { name } = _options;
    const context = createPluginContext(name);

    at.on('computed', (computed) => {
        // 重置status
        // 重置status
        resetState(context);

        // 禁止
        if(isDisabled(context)) return;
        const isValid = test(computed, _options,context.state);

        context.state = flow(isValid, context.state, computed.phase);
        if (isValid) {
            at.emit2(name, computed, context);
            at.emit2(name + getStatusName(context.state), computed, context);
            // context.emit2('at', computed);
            // context.emit2('at:after', { ...computed, name: _options.name });
        }
        else if ([STATE.END, STATE.CANCELLED].includes(context.state)) {
            at.emit2(name + getStatusName(context.state), computed, context);
        }
    });

    // 加载计算方法, 有前后顺序
    at.compute([ComputeVectorForMutli, ComputeScale]);

    return context;
}

function test(computed: Computed, options: typeof DEFAULT_OPTIONS,state:RECOGNIZER_STATE) {
    const { pointLength, scale, deltaScale } = computed;
    return (options.pointLength === pointLength && (void 0 !== scale && void 0 !== deltaScale && options.threshold < Math.abs(scale - 1)||isRecognized(state)))
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
