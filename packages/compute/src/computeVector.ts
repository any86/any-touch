import { PureInput, Vector } from '@any-touch/shared/types';
import { CLIENT_X, CLIENT_Y } from '@any-touch/shared';
export default function computeVector(input: PureInput): Vector {
    return {
        x: input.points[1][CLIENT_X] - input.points[0][CLIENT_X],
        y: input.points[1][CLIENT_Y] - input.points[0][CLIENT_Y]
    }
};