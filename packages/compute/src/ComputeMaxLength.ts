import type { Input } from '@any-touch/shared';
import { TYPE_START } from '@any-touch/shared';

function ComputeMaxLength() {
    let maxPointLength = 0;
    return function (input: Input) {
        const { phase } = input;
        if (TYPE_START === phase) {
            maxPointLength = input.pointLength;
        }
        return { maxPointLength };
    }
}
export default ComputeMaxLength;