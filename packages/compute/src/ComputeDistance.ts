
import type { DIRECTION, Input } from '@any-touch/shared';
import { CLIENT_X, CLIENT_Y, STAGE } from '@any-touch/shared';
import { getVLength, getDirection } from '@any-touch/vector';

function ComputeDistance() {
    let displacementX = 0;
    let displacementY = 0;
    let distanceX = 0;
    let distanceY = 0;
    let distance = 0;
    return function (input: Input): {
        displacementX: number, displacementY: number, distanceX: number, distanceY: number, distance: number, getDirection: (x: number, y: number) => DIRECTION | void
    } {
        const { stage, startInput } = input;

        if (STAGE.START === stage) {
            displacementX = 0;
            displacementY = 0;
            distanceX = 0;
            distanceY = 0;
            distance = 0;
        }

        else if (STAGE.MOVE === stage) {
            // 矢量
            displacementX = Math.round(input.points[0][CLIENT_X] - startInput.points[0][CLIENT_X]);
            displacementY = Math.round(input.points[0][CLIENT_Y] - startInput.points[0][CLIENT_Y]);
            // 标量
            distanceX = Math.abs(displacementX);
            distanceY = Math.abs(displacementY);
            distance = Math.round(getVLength({ x: distanceX, y: distanceY }));
        }

        return {
            displacementX, displacementY, distanceX, distanceY, distance, getDirection
        };
    };
};
ComputeDistance._id = `__ComputeDistance__`;
export default ComputeDistance;