import type { Input } from '@any-touch/shared';
import { getAngle } from '@any-touch/vector';
import _computeVectorForMutli from './_computeVectorForMutli';

/**
 * 计算角度
 * @param  input 输入
 */
function ComputeAngle() {
    return function (input: Input): { angle: number, deltaAngle: number } | void {
        const vs = _computeVectorForMutli(input);
        if (void 0 !== vs && vs.activeV) {
            const { prevV, startV, activeV } = vs;
            const deltaAngle = Math.round(getAngle(activeV, prevV));
            const angle = Math.round(getAngle(activeV, startV));
            return { angle, deltaAngle };
        }
    };
}

ComputeAngle._id = `__ComputeAngle__`;
export default ComputeAngle;