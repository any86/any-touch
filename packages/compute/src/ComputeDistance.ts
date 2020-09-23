
import type { Input, DIRECTION } from '@any-touch/shared';
import { CLIENT_X, CLIENT_Y, STAGE} from '@any-touch/shared';
import { getVLength, getDirection } from '@any-touch/vector';

function ComputeDistance() {
    let displacementX = 0;
    let displacementY = 0;
    let distanceX = 0;
    let distanceY = 0;
    let distance = 0;
    let overallDirection: DIRECTION | undefined;

    return function (input: Input) {
        const { stage, startInput } = input;

        if (STAGE.START === stage) {
            displacementX = 0;
            displacementY = 0;
            distanceX = 0;
            distanceY = 0;
            distance = 0;
        }

        else if (STAGE.MOVE === stage) {
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
ComputeDistance._id = `__ComputeDistance__`;
export default ComputeDistance;