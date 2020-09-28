import type { Vector, InputOnlyHasCurrent, Input } from '@any-touch/shared';
import { CLIENT_X, CLIENT_Y } from '@any-touch/shared';
function computeVector(input: InputOnlyHasCurrent): Vector {
    return {
        x: input.points[1][CLIENT_X] - input.points[0][CLIENT_X],
        y: input.points[1][CLIENT_Y] - input.points[0][CLIENT_Y]
    }
};

export default function (input: Input): { startV: Vector, activeV: Vector, prevV: Vector } | void {
    const { prevInput, startMultiInput } = input;
    if (void 0 !== startMultiInput &&
        void 0 !== prevInput &&
        input.id !== startMultiInput.id &&
        1 < prevInput.pointLength &&
        1 < input.pointLength) {
        // 2指形成的向量
        return {
            startV: computeVector(startMultiInput),
            prevV: computeVector(prevInput),
            activeV: computeVector(input)
        }
    }
}