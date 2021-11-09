import { EventTrigger, Computed, Input } from '@any-touch/shared';
import { ComputeDistance, ComputeDeltaXY, ComputeVAndDir } from '@any-touch/compute';
import Recognizer, { recognizeForPressMoveLike } from '@any-touch/recognizer';
// v2
// import Core from '@any-touch/core';
import AnyTouch from 'any-touch';

const DEFAULT_OPTIONS = {
    name: 'pan',
    threshold: 10,
    pointLength: 1,
};

export default function (context: AnyTouch, {
    name = 'pan',
    threshold = 10,
    pointLength = 1,
}={}) {
    context.on('computed', (computed) => {
        const {distance} = computed;
        console.log(name);
    });


    

    context.compute([ComputeVAndDir, ComputeDistance, ComputeDeltaXY]);
}


// function test(computed: Computed) {
//     const { pointLength, distance } = computed;
//     return (
//         // INPUT_MOVE === phase &&
//         (this._$isRecognized || this.options.threshold <= distance) &&
//         this._$isValidPointLength(pointLength)
//     );
// }


// export default class extends Recognizer {
//     constructor(options: Partial<typeof DEFAULT_OPTIONS>) {
//         super({ ...DEFAULT_OPTIONS, ...options });
//         this.computeFunctions = [ComputeVAndDir, ComputeDistance, ComputeDeltaXY];
//     }

//     /**
//      * 必要条件
//      * @param computed 计算数据
//      * @return 是否是当前手势
//      */
//     _$test(computed: Computed): boolean {
//         const { pointLength, distance } = computed;
//         return (
//             // INPUT_MOVE === phase &&
//             (this._$isRecognized || this.options.threshold <= distance) &&
//             this._$isValidPointLength(pointLength)
//         );
//     }

//     /**
//      * 开始识别
//      * @param input 输入
//      * @param emit 触发事件函数
//      */
//     recognize(computed: Computed, emit: EventTrigger): void {
//         // 需要有方向
//         const isRecognized = void 0 !== computed.direction && recognizeForPressMoveLike(this, computed, emit);
//         // panleft/panup/panright/pandown
//         if (isRecognized) {
//             emit(this.options.name + computed.direction);
//         }
//     }
// }
