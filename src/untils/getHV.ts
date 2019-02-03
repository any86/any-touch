/**
 * 获取数组中方向是否水平/垂直
 * @param {directionString[]} 方向数组, ['left', 'right','up', 'down']
 * 
 */
import {directionString} from '../interface';
export default (directions: [directionString?, directionString?, directionString?, directionString?]): { hasHorizontal: boolean, hasVertical: boolean } => {
    let hasHorizontal = false;
    let hasVertical = false;
    for (let direction of directions) {
        if (-1 < ['left', 'right'].indexOf(<string>direction)) {
            hasHorizontal = true;
            if (hasVertical) break;
        } else if (-1 < ['up', 'down'].indexOf(<string>direction)) {
            hasVertical = true;
            if (hasHorizontal) break;
        } else {
            throw new Error('wrong direction!');
        }
    };
    return { hasHorizontal, hasVertical };
};