
import { Input, directionString } from '@any-touch/types';
import { CLIENT_X, CLIENT_Y, INPUT_MOVE, INPUT_START } from '@any-touch/shared/const';
import { NONE } from '@any-touch/vector/DIRECION';
import getVLength from '@any-touch/vector/getVLength';
import getDirection from '@any-touch/vector/getDirection';


export default class ComputeDistance {
    displacementX = 0;
    displacementY = 0;
    distanceX = 0;
    distanceY = 0;
    distance = 0;
    overallDirection: directionString = NONE;

    compute(input: Input): { displacementX: number, displacementY: number, distanceX: number, distanceY: number, distance: number, overallDirection: directionString } {
        const { inputType, startInput } = input;
        if (INPUT_START === inputType) {
            this.displacementX = 0;
            this.displacementY = 0;
            this.distanceX = 0;
            this.distanceY = 0;
            this.distance = 0;
            this.overallDirection = NONE;
        }

        else if (INPUT_MOVE === inputType) {
            this.displacementX = Math.round(input.points[0][CLIENT_X] - startInput.points[0][CLIENT_X]);
            this.displacementY = Math.round(input.points[0][CLIENT_Y] - startInput.points[0][CLIENT_Y]);
            this.distanceX = Math.abs(this.displacementX);
            this.distanceY = Math.abs(this.displacementY);
            this.distance = Math.round(getVLength({ x: this.distanceX, y: this.distanceY }));
            this.overallDirection = getDirection(this.displacementX, this.displacementY);
        }

        const {
            displacementX, displacementY, distanceX, distanceY, distance, overallDirection
        } = this;

        return {
            displacementX, displacementY, distanceX, distanceY, distance, overallDirection
        };
    };
}