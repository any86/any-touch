import { Input } from '@any-touch/types';
import { INPUT_START } from '@any-touch/shared/const';
export default class ComputeMaxLength {
    maxPointLength = 0;

    compute(input: Input): { maxPointLength: number } {
        const { inputType } = input;
        if (INPUT_START === inputType) {
            this.maxPointLength = input.pointLength;
        }
        return { maxPointLength: this.maxPointLength };
    }
}