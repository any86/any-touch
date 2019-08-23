import { Input, directionString } from '../interface';
import Store from '../Store';
export default function ({ startInput, input }: {
    startInput: Input;
    input: Input;
}, $store: Store): {
    displacementX: number;
    displacementY: number;
    distanceX: number;
    distanceY: number;
    distance: number;
    overallDirection: directionString;
};
