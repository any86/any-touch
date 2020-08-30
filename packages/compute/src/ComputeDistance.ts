
import type { Input, directionString } from '@any-touch/shared';
import { CLIENT_X, CLIENT_Y, INPUT_MOVE, INPUT_START, NONE } from '@any-touch/shared';
import { getVLength, getDirection } from '@any-touch/vector';

function computeDistance() {
    let displacementX = 0;
    let displacementY = 0;
    let distanceX = 0;
    let distanceY = 0;
    let distance = 0;
    let overallDirection: directionString = NONE;

    return function (input: Input): { displacementX: number, displacementY: number, distanceX: number, distanceY: number, distance: number, overallDirection: directionString } {
        const { stage, startInput } = input;

        if (INPUT_START === stage) {
            displacementX = 0;
            displacementY = 0;
            distanceX = 0;
            distanceY = 0;
            distance = 0;
            overallDirection = NONE;
        }

        else if (INPUT_MOVE === stage) {
            displacementX = Math.round(input.points[0][CLIENT_X] - startInput.points[0][CLIENT_X]);
            displacementY = Math.round(input.points[0][CLIENT_Y] - startInput.points[0][CLIENT_Y]);
            distanceX = Math.abs(displacementX);
            distanceY = Math.abs(displacementY);
            distance = Math.round(getVLength({ x: distanceX, y: distanceY }));
            overallDirection = getDirection(displacementX, displacementY);
        }
        return {
            displacementX, displacementY, distanceX, distanceY, distance, overallDirection
        };
    };
};
computeDistance._id = `computeDistance`;
export default computeDistance;