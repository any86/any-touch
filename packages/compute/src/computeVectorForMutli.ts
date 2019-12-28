import { Vector, Input } from '@types';
import computeVector from './computeVector';

export default class ComputeVectorForMutli {
    compute(input: Input): { startV: Vector, activeV: Vector, prevV: Vector } | void {
        const { prevInput, startMultiInput } = input;
        if (void 0 !== startMultiInput &&
            void 0 !== prevInput &&
            input.id !== startMultiInput.id &&
            1 < input.pointLength) {
            // 2指形成的向量
            return {
                startV: computeVector(startMultiInput),
                prevV: computeVector(prevInput),
                activeV: computeVector(input)
            }
        }
    }
}