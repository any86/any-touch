import { directionString } from '@/types';
import { NONE } from '@/const';
export default function (recognizer: any, direction?: directionString) {
    return -1 !== recognizer.options.directions.indexOf(direction) || NONE === direction;
};