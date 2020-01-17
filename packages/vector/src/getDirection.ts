import {DIRECTION_UP, DIRECTION_DOWN, DIRECTION_RIGHT, DIRECTION_LEFT, NONE } from '@any-touch/shared';
import { directionString} from '@any-touch/shared/types';

/**
 * 
 * @param {Number} 事件开始到结束的X位移 
* @param {Number} 事件开始到结束的Y位移 
 */
export default (x: number, y: number): directionString => {
    if (x === y) {
        return NONE;
    } else if (Math.abs(x) > Math.abs(y)) {
        return 0 < x ? DIRECTION_RIGHT : DIRECTION_LEFT;
    } else {
        return 0 < y ? DIRECTION_DOWN : DIRECTION_UP;
    }
};
