
import { Vector } from '@any-touch/shared';
/**
 * 获取向量长度(向量模)
 * @param {Object} 向 量
 */
export default(v: Vector): number => {
    return Math.sqrt(v.x * v.x + v.y * v.y);
}