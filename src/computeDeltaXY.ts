import { propX, propY } from './const';
/**
 *  计算每次触碰之间的位移,
 * @param {Object} 有clientX/Y信息的有效输入 
 * @param {Object} 上一次的触碰输入
 * @returns {Object} 偏移信息
 */
export default function (validInput: any, prevInput: any): { deltaX: number, deltaY: number, deltaTime: number } {
    let deltaX = 0;
    let deltaY = 0;
    let deltaTime = 0;
    const {round} = Math;
    // 当start阶段的时候是没有prevInput的;
    if(undefined !== prevInput && 0 !== prevInput.pointers.length) {
        deltaX = round(validInput.pointers[0][propX] - prevInput.pointers[0][propX]);
        deltaY = round(validInput.pointers[0][propY] - prevInput.pointers[0][propY]);
        deltaTime = validInput.timestamp - prevInput.timestamp;
    }
    return { deltaX, deltaY, deltaTime };
};