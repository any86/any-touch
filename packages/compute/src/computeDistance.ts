
import { Input, directionString } from '@types';
import { CLIENT_X, CLIENT_Y, NONE, INPUT_MOVE } from '@const';
import { getVLength, getDirection } from '@any-touch/vector';

export default class ComputeDistance {
    displacementX?: number;
    displacementY?: number;
    distanceX?: number;
    distanceY?: number;
    distance?: number;
    overallDirection?: directionString;

    compute(input: Input): { displacementX: number, displacementY: number, distanceX: number, distanceY: number, distance: number, overallDirection: directionString } {
        const { inputType, startInput } = input;
        this.displacementX = 0;
        this.displacementY = 0;
        this.distanceX = 0;
        this.distanceY = 0;
        this.distance = 0;
        this.overallDirection = NONE;
        if (INPUT_MOVE === inputType) {
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