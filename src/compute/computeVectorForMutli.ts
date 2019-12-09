import { InputRecord, Vector, Input } from '../types';
import computeVector from './computeVector';

export default function ({
    startMultiInput,
    prevInput,
    input
}: InputRecord): { startV: Vector, activeV: Vector, prevV: Vector } | void {
    if (void 0 !== startMultiInput &&
        input.id !== startMultiInput.id &&
        1 < input.pointLength) {
        // 2指形成的向量
        return {
            startV: computeVector(startMultiInput),
            prevV: computeVector(<Input>prevInput),
            activeV: computeVector(input)
        }
    }
};