import type { Input } from '@any-touch/shared';
import { round2 } from '@any-touch/shared';
import { getVLength } from '@any-touch/vector';
import _computeVectorForMutli from './_computeVectorForMutli'

function ComputeScale() {
    return function (input: Input): { scale: number, deltaScale: number } | void {
        const vs = _computeVectorForMutli(input);
        if (void 0 !== vs && vs.activeV) {
            const { prevV, startV, activeV } = vs;
            const deltaScale = round2(getVLength(activeV) / getVLength(prevV));
            const scale = round2(getVLength(activeV) / getVLength(startV));
            return { scale, deltaScale };
        }
    };
}

ComputeScale._id = `__ComputeScale__`;
export default ComputeScale;