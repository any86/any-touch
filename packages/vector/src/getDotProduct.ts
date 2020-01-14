import { Vector } from '@any-touch/types';

/**
 * 点积
 * @param {Object} v1
 * @param {Object} v2
 */
export default (v1: Vector, v2: Vector) => {
    return v1.x * v2.x + v1.y * v2.y;
}