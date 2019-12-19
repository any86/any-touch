import { directionString } from '@any-touch/types';
import { NONE } from '@any-touch/const';
export default function (recognizer: any, direction?: directionString) {
    return -1 !== recognizer.options.directions.indexOf(direction) || NONE === direction;
};