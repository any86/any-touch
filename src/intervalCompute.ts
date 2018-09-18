import { Input,Computed } from './interface';
import { getCenter, getAngle, getVLength, getDirection } from './vector';
import { propX, propY } from './const';
let prevInput;
export default function (input:Input): any {
    if(undefined === prevInput || prevInput.time) {
        prevInput = input;
    }
};