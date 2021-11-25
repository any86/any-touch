import type { Vector, InputOnlyHasCurrent, Input } from '@any-touch/shared';
import { CLIENT_X, CLIENT_Y } from '@any-touch/shared';
function computeVector(input: InputOnlyHasCurrent): Vector {
    return {
        x: input.points[1][CLIENT_X] - input.points[0][CLIENT_X],
        y: input.points[1][CLIENT_Y] - input.points[0][CLIENT_Y]
    }
};

/**
 * 
 * @param input 输入
 * @returns 记录多点输入时的"起/上一个/终"向量
 */
export default function () {
    return function (input: Input) {
        console.log(JSON.stringify(input.points));
        const { prevInput, startMultiInput } = input;
        if (void 0 !== startMultiInput &&
            void 0 !== prevInput &&
            input.id !== startMultiInput.id &&
            1 < prevInput.pointLength &&
            1 < input.pointLength) {
            // 2指形成的向量
            return {
                startVecotr: computeVector(startMultiInput),
                prevVecotr: computeVector(prevInput),
                activeVecotr: computeVector(input)
            }
        }
    }
}


// export default function ComputeVectorForMutli() {
//     return function (input: Input): { startV: Vector, activeV: Vector, prevV: Vector } | void {
//         const { prevInput, startMultiInput } = input;
//         if (void 0 !== startMultiInput &&
//             void 0 !== prevInput &&
//             input.id !== startMultiInput.id &&
//             1 < prevInput.pointLength &&
//             1 < input.pointLength) {
//             // 2指形成的向量
//             return {
//                 startV: computeVector(startMultiInput),
//                 prevV: computeVector(prevInput),
//                 activeV: computeVector(input)
//             }
//         }
//     }
// };