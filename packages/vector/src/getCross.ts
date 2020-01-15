import { Vector } from '@any-touch/shared/types';
/**
 * 求旋转方向
 * 顺时针/逆时针
 */
export default (v1: Vector, v2: Vector) => {
    return v1.x * v2.y - v2.x * v1.y;
}
