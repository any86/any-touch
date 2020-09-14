import type { Input, Point,VS } from '@any-touch/shared';
import { round2 } from '@any-touch/shared';
import { getVLength } from '@any-touch/vector';
import _computeVectorForMutli from './_computeVectorForMutli'

function ComputeScale() {
    return function (input: Input & {_vs?:VS}): { scale: number, deltaScale: number, _vs: { prevV: Point, startV: Point, activeV: Point } } | void {
        const _vs = input?._vs || _computeVectorForMutli(input);
        if (void 0 !== _vs && _vs.activeV) {
            const { prevV, startV, activeV } = _vs;
            const deltaScale = round2(getVLength(activeV) / getVLength(prevV));
            const scale = round2(getVLength(activeV) / getVLength(startV));
            return { scale, deltaScale, _vs };
        }
    };
}

ComputeScale._id = `__ComputeScale__`;
export default ComputeScale;