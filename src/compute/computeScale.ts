import { getVLength } from '../vector';
let prevScale: number = 1;
export default function ({
    startV, activeV
}: any): { scale: number, deltaScale: number } {
    const scale = getVLength(activeV) / getVLength(startV);
    const deltaScale = scale / prevScale;
    prevScale = scale;
    return { scale, deltaScale };
};