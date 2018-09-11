let output = { velocityX: 0, velocityY: 0 };
import { propX, propY } from './const';
/**
 *  计算每次触碰之间的位移,
 * @param {Object} 有clientX/Y信息的有效输入 
 * @param {Object} 上一次的触碰输入
 * @returns {Object} 偏移信息
 */
export default function ({ deltaX, deltaY, deltaTime }: { deltaX: number, deltaY: number, deltaTime: number }): { velocityX: number, velocityY: number } {
    if (0 !== deltaTime) {
        output.velocityX = deltaX / deltaTime;
        output.velocityY = deltaY / deltaTime;
    }
    return output;
};