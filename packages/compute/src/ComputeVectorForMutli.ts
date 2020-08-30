import { Vector, Input } from '@any-touch/shared';
import computeVector from './computeVector';

function ComputeVectorForMutli() {
    return function (input: Input): { startV: Vector, activeV: Vector, prevV: Vector } | void {
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
};
ComputeVectorForMutli._id = `ComputeVectorForMutli`;
export default ComputeVectorForMutli;