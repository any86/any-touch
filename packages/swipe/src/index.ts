import type { Computed, RECOGNIZER_STATUS } from '@any-touch/shared';
import { INPUT_END, STATUS_POSSIBLE } from '@any-touch/shared';
import { ComputeDistance, ComputeVAndDir, ComputeMaxLength } from '@any-touch/compute';
import Core from '@any-touch/core'
const DEFAULT_OPTIONS = {
    name: 'swipe',
    threshold: 10,
    velocity: 0.3,
    pointLength: 1,
};

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
        if (test(computed, _options)) {
            context.emit2(_options.name, computed);
            context.emit2(_options.name + computed.direction, computed);
            context.emit2('at', computed);
            context.emit2('at:after', {...computed,name:_options.name});
        }
    });

    // 加载计算方法
    context.compute([ComputeDistance, ComputeVAndDir, ComputeMaxLength]);
    return { status }
}

function test(computed: Required<Computed>, options: typeof DEFAULT_OPTIONS) {
    if (INPUT_END !== computed.phase) return false;
    const { velocityX, velocityY, maxPointLength, distance } = computed;
    return options.pointLength === maxPointLength &&
        options.threshold < distance &&
        options.velocity < Math.max(velocityX, velocityY);
}







// class A extends Recognizer {
//     constructor(options: Partial<typeof DEFAULT_OPTIONS>) {
//         super({ ...DEFAULT_OPTIONS, ...options });
//         this.computeFunctions = [ComputeDistance, ComputeVAndDir, ComputeMaxLength];
//     };

//     /**
//      * 识别条件
//      * @param {AnyTouchEvent} 计算数据
//      */
//     _$test(computed: Computed): boolean {
//         // 非end阶段, 开始校验数据
//         if (INPUT_END !== computed.phase) return false;
//         const { velocityX, velocityY, maxPointLength, distance } = computed;
//         return this.options.pointLength === maxPointLength &&
//             this.options.threshold < distance &&
//             this.options.velocity < Math.max(velocityX, velocityY);
//     };
//     /**
//      * 开始识别
//      * @param {Input} 输入 
//      */
//     recognize(computed: Computed, emit: EventTrigger) {
//         if (this._$test(computed)) {
//             emit(this.options.name);
//             // swipeleft...
//             emit(this.options.name + computed.direction);
//         }

//     };
// };