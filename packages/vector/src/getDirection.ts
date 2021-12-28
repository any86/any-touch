import { DIRECTION_UP, DIRECTION_DOWN, DIRECTION_RIGHT, DIRECTION_LEFT } from '@any-touch/shared';
import { directionString } from '@any-touch/shared';

/**
 * 计算点相对于(0,0)的方向
 * @param x 事件开始到结束的X位移 
 * @param y 事件开始到结束的Y位移 
 */
export default (x: number, y: number): directionString | undefined => {
    // 不移动, 就没有方向
    if (0 === x && 0 === y) {
        return;
    }

    if (Math.abs(x) >= Math.abs(y)) {
        return 0 < x ? DIRECTION_RIGHT : DIRECTION_LEFT;
    } else {
        return 0 < y ? DIRECTION_DOWN : DIRECTION_UP;
    }
};
