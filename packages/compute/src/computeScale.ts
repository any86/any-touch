import { Vector,round2 } from '@any-touch/shared';
import {getVLength} from '@any-touch/vector';
export default function computeScale({
    startV, prevV, activeV
}:  Record<string,Vector>): { scale: number, deltaScale: number } {
    const deltaScale = round2(getVLength(activeV) / getVLength(prevV));
    const scale = round2(getVLength(activeV) / getVLength(startV));
    return { scale, deltaScale };
};