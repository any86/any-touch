import type { Input } from '@any-touch/shared';
import { INPUT_START } from '@any-touch/shared';

function ComputeMaxLength() {
    let maxPointLength = 0;
    console.log({maxPointLength});
    return function (input: Input) {
        const { phase } = input;
        if (INPUT_START === phase) {
            maxPointLength = input.pointLength;
        }
        return { maxPointLength };
    }
}
export default ComputeMaxLength;