
let prevDisplacementX = 0;
let prevDisplacementY = 0;
import { propX, propY } from '../const';
import { getVLength } from '../vector';
export default function ({
    status,
    startInput,
    input
}: any): any {
    const { round, abs } = Math;
    let displacementX = 0;
    let displacementY = 0;
    if ('move' === status) {
        displacementX = round(input.pointers[0][propX] - startInput.pointers[0][propX]);
        displacementY = round(input.pointers[0][propY] - startInput.pointers[0][propY]);

        // 记录本次位移
        prevDisplacementX = displacementX;
        prevDisplacementY = displacementY;
    } else if ('end' === status) {
        displacementX = prevDisplacementX;
        displacementY = prevDisplacementY;
    }

    let distanceX = abs(displacementX);
    let distanceY = abs(displacementY);
    let distance = round(getVLength({ x: distanceX, y: distanceY }));
    return {
        displacementX, displacementY, distanceX, distanceY, distance
    };
};