import { Vector } from '@any-touch/shared/types';
import getRadian from '@any-touch/vector/getRadian';
import getCross from '@any-touch/vector/getCross';
import radianToAngle from '@any-touch/vector/radianToAngle';

/**
 * 向量夹角(角度)
 * @param {Object} v1
 * @param {Object} v2
 */
export default (v1: Vector, v2: Vector) => {
    var angle = getRadian(v1, v2);
    if (getCross(v1, v2) > 0) {
        angle *= -1;
    }
    return radianToAngle(angle);
};
