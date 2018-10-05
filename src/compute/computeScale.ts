import { getVLength } from '../vector';
export default function ({
    startV, prevV, activeV
}: any): { scale: number, deltaScale: number } {
    const deltaScale = getVLength(activeV) / getVLength(prevV);
    const scale = getVLength(activeV) / getVLength(startV);
    return { scale, deltaScale };
};