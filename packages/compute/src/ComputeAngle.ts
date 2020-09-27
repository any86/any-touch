import type { Input,VS, Point } from '@any-touch/shared';
import { getAngle } from '@any-touch/vector';
import _computeVectorForMutli from './_computeVectorForMutli';

/**
 * 计算角度
 * @param  input 输入
 */
function ComputeAngle() {
    return function (input: Input & {_vs?:VS}): { angle: number, deltaAngle: number, _vs: { prevV: Point, startV: Point, activeV: Point } } | void {
        const _vs =  input?._vs || _computeVectorForMutli(input);
        if (void 0 !== _vs && _vs.activeV) {
            const { prevV, startV, activeV } = _vs;
            const deltaAngle = Math.round(getAngle(activeV, prevV));
            const angle = Math.round(getAngle(activeV, startV));
            return { angle, deltaAngle, _vs };
        }
    };
}

ComputeAngle._id = `__ComputeAngle__`;
export default ComputeAngle;