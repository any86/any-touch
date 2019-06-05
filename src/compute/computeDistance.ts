
import { Input,directionString } from '../interface';
import cache from '../$_cache';
import { propX, propY } from '../const';
import { getVLength, getDirection } from '../vector';
export default function ({
    startInput,
    input
}: {
    startInput: Input,
    input: Input
}): { displacementX: number, displacementY: number, distanceX: number, distanceY: number, distance: number, overallDirection: directionString } {
    const { eventType } = input;
    let displacementX = 0;
    let displacementY = 0;
    if ('start' === eventType) {
        cache.set({ displacementX });
        cache.set({ displacementY });
    } else if ('move' === eventType) {
        displacementX = Math.round(input!.points[0][propX] - startInput!.points[0][propX]);
        displacementY = Math.round(input!.points[0][propY] - startInput!.points[0][propY]);
        // 记录本次位移
        cache.set({ displacementX });
        cache.set({ displacementY });
    } else if ('end' === eventType) {
        displacementX = cache.get('displacementX', 0);
        displacementY = cache.get('displacementY', 0);
    }

    const distanceX = Math.abs(displacementX);
    const distanceY = Math.abs(displacementY);
    const distance = Math.round(getVLength({ x: distanceX, y: distanceY }));
    const overallDirection = getDirection(displacementX, displacementY);
    return {
        displacementX, displacementY, distanceX, distanceY, distance, overallDirection
    };
};