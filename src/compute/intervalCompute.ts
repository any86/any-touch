// 返回最近一个时间段的计算结果
// 默认间隔25ms做一次计算, 让数据更新,
// 让end阶段读取上一步的计算数据, 比如方向, 速率等...
// 防止快速滑动到慢速滑动的手势识别成swipe
import { Input } from '../interface';
import { COMPUTE_INTERVAL, INPUT_CANCEL, INPUT_END } from '../const';
import { getDirection } from '../vector';
import cache from '../$_cache';

export default ({ prevInput, input }: { prevInput: Input, input: Input }): { speedX: number, speedY: number, velocityX: number, velocityY: number, direction?: string } => {
    // _prevInput || input用来保证deltaX等不会有undefined参与计算
    const _prevInput = prevInput || input;
    // 速率
    let velocityX: number;
    let velocityY: number;

    // 速度
    let speedX: number;
    let speedY: number;

    // 方向
    let direction: string;

    const deltaTime = input.timestamp - _prevInput.timestamp;
    // console.log({deltaTime})
    // 每25ms刷新速度数据
    if (-1 === [INPUT_CANCEL, INPUT_END].indexOf(input.eventType) && (COMPUTE_INTERVAL < deltaTime || undefined === cache.get('direction'))) {
        const deltaX = input.x - _prevInput.x;
        const deltaY = input.y - _prevInput.y;
        // console.log({deltaX,deltaY})
        speedX = Math.round(deltaX / deltaTime * 100) / 100;
        speedY = Math.round(deltaY / deltaTime * 100) / 100;
        velocityX = Math.abs(speedX);
        velocityY = Math.abs(speedY);
        direction = getDirection(deltaX, deltaY) || cache.get('direction');
        // 存储状态
        cache.set({ speedX });
        cache.set({ speedY });
        cache.set({ velocityX });
        cache.set({ velocityY });
        cache.set({ direction });
    } else {
        speedX = cache.get('speedX', 0);
        speedY = cache.get('speedY', 0);
        velocityX = cache.get('velocityX', 0);
        velocityY = cache.get('velocityY', 0);
        direction = cache.get('direction');
    }
    return { velocityX, velocityY, speedX, speedY, direction };
};