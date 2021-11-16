import type { RECOGNIZER_STATE, Computed, KV } from '@any-touch/shared';
import {
    STATE_FAILED, STATE_RECOGNIZED, STATE_END, STATE_CANCELLED, STATE_POSSIBLE, DIRECTION_UP, TYPE_CANCEL, TYPE_END, TYPE_START
} from '@any-touch/shared';
import { ComputeDistance } from '@any-touch/compute';
import Core from '@any-touch/core';

const DEFAULT_OPTIONS = {
    name: 'press',
    pointLength: 1,
    maxDistance: 9,
    minPressTime: 251,
};
/**
 * "拖拽"识别器
 * @param context AnyTouch实例
 * @param options AnyTouch选项
 * @returns  
 */
export default function (context: Core, options?: Partial<typeof DEFAULT_OPTIONS>) {
    const _options = { ...options, ...DEFAULT_OPTIONS };
    let state: RECOGNIZER_STATE = STATE_POSSIBLE;
    let timeoutId = 0;
    context.on('computed', (computed) => {

        const { phase, startInput, pointLength } = computed;
        // 1. start阶段
        // 2. 触点数符合
        // 那么等待minPressTime时间后触发press
        if (TYPE_START === phase && _options.pointLength === pointLength) {
            // 重置状态
            // 重置status
            if ([STATE_END, STATE_CANCELLED, STATE_RECOGNIZED, STATE_FAILED].includes(state)) {
                state = STATE_POSSIBLE;
            };

            // 延迟触发
            clearTimeout(timeoutId)
            timeoutId = (setTimeout as Window['setTimeout'])(() => {
                state = STATE_RECOGNIZED;
                context.emit2(_options.name, computed);
            }, _options.minPressTime);
        }
        // 触发pressup条件:
        // 1. end阶段
        // 2. 已识别
        else if (TYPE_END === phase && STATE_RECOGNIZED === state) {
            context.emit2(`${_options.name}${DIRECTION_UP}`, computed);
        }
        else if (STATE_RECOGNIZED !== state) {
            const deltaTime = computed.timestamp - startInput.timestamp;
            // 一旦不满足必要条件,
            // 发生了大的位移变化
            if (!test(computed, _options) ||
                // end 或 cancel触发的时候还不到要求的press触发时间
                (_options.minPressTime > deltaTime && [TYPE_END, TYPE_CANCEL].includes(phase))) {
                clearTimeout(timeoutId)
                state = STATE_FAILED;
            }
        }
    });

    // 加载计算方法
    context.compute([ComputeDistance]);

    return () => ({ ..._options, state });
}


/**
 * 是否满足:
 * 移动距离不大
 */
function test(computed: Required<Computed>, options: typeof DEFAULT_OPTIONS) {
    const { distance } = computed;
    return options.maxDistance > distance;
};


// class Press extends Recognizer {
//     private _timeoutId?: number;

//     constructor(options: Partial<typeof DEFAULT_OPTIONS>) {
//         super({ ...DEFAULT_OPTIONS, ...options });
//         this.computeFunctions = [ComputeDistance];
//     };

   
// };