import type { Input } from '@any-touch/shared';
import { INPUT_START } from '@any-touch/shared';

function computeMaxLength() {
    let maxPointLength = 0;
    return function (input: Input) {
        const { stage } = input;
        if (INPUT_START === stage) {
            maxPointLength = input.pointLength;
        }
        return { maxPointLength };
    }
}
computeMaxLength._id = `computeMaxLength`;
export default computeMaxLength;