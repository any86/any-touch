
import cache from '../$_cache';
import { propX, propY } from '../const';
import { getVLength } from '../vector';
export default function ({
    startInput,
    input
}: any): any {
    const { eventType } = input;
    const { round, abs } = Math;
    let displacementX = 0;
    let displacementY = 0;
    if ('start' === eventType) {
        cache.set({displacementX});
        cache.set({displacementY});
    } else if ('move' === eventType) {
        displacementX = round(input.points[0][propX] - startInput.points[0][propX]);
        displacementY = round(input.points[0][propY] - startInput.points[0][propY]);
        // 记录本次位移
        cache.set({displacementX});
        cache.set({displacementY});
    } else if ('end' === eventType) {
        displacementX = cache.get('displacementX', 0);
        displacementY = cache.get('displacementY', 0);
    }

    let distanceX = abs(displacementX);
    let distanceY = abs(displacementY);
    let distance = round(getVLength({ x: distanceX, y: distanceY }));
    return {
        displacementX, displacementY, distanceX, distanceY, distance
    };
};