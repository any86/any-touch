import { Vector } from '@any-touch/shared/types';
import getVLength from './getVLength';
import getDotProduct from './getDotProduct';
/**
 * 向量夹角(弧度)
 * @param {Object} v1
 * @param {Object} v2
 */
export default(v1: Vector, v2: Vector) => {
    var mr = getVLength(v1) * getVLength(v2);
    if (mr === 0) return 0;
    var r = getDotProduct(v1, v2) / mr;
    if (r > 1) r = 1;
    return Math.acos(r);
}
