import { Vector } from '@any-touch/shared/types';
import getVLength from '@any-touch/vector/getVLength';
export default function computeScale({
    startV, prevV, activeV
}:  Record<string,Vector>): { scale: number, deltaScale: number } {
    const deltaScale = getVLength(activeV) / getVLength(prevV);
    const scale = getVLength(activeV) / getVLength(startV);
    return { scale, deltaScale };
};