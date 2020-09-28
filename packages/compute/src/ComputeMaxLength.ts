import type { Input } from '@any-touch/shared';
import { STAGE } from '@any-touch/shared';

function ComputeMaxLength() {
    let maxPointLength = 0;
    return function (input: Input):{maxPointLength:number} {
        const { stage } = input;
        if (STAGE.START === stage) {
            maxPointLength = input.pointLength;
        }
        return { maxPointLength };
    }
}
ComputeMaxLength._id = `__ComputeMaxLength__`;
export default ComputeMaxLength;