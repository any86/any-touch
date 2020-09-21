import { DIRECTION, NONE } from '@any-touch/shared';

/**
 * 计算点相对于(0,0)的方向
 * @param x 事件开始到结束的X位移 
 * @param y 事件开始到结束的Y位移 
 */
export default function (x: number, y: number) {
    if (Math.abs(x) > Math.abs(y)) {
        return 0 < x ? DIRECTION.RIGHT : DIRECTION.LEFT;
    } else if (Math.abs(x) < Math.abs(y)) {
        return 0 < y ? DIRECTION.DOWN : DIRECTION.UP;
    }
};