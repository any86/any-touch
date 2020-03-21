import type { Input } from '@any-touch/shared';
import { INPUT_START } from '@any-touch/shared';

function computeMaxLength() {
    let maxPointLength = 0;
    return function (input: Input) {
        const { inputType } = input;
        if (INPUT_START === inputType) {
            maxPointLength = input.pointLength;
        }
        return { maxPointLength };
    }
}
computeMaxLength._id = `computeMaxLength`;
export default computeMaxLength;
// export default class {
//     static _id='ComputeMaxLength';
//     maxPointLength = 0;

//     compute(input: Input): { maxPointLength: number } {
//         const { inputType } = input;
//         if (INPUT_START === inputType) {
//             this.maxPointLength = input.pointLength;
//         }
//         return { maxPointLength: this.maxPointLength };
//     }
// }