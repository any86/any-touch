// 返回最近一个时间段的计算结果
// 默认间隔25ms做一次计算, 让数据更新,
// 让end阶段读取上一步的计算数据, 比如方向, 速率等...
// 防止快速滑动到慢速滑动的手势识别成swipe
import { Input,directionString } from '../interface';
import { COMPUTE_INTERVAL, NONE,INPUT_CANCEL, INPUT_END } from '../const';
import { getDirection } from '../vector';
import Store from '../Store';

export default ({ prevInput, input }: { prevInput?: Input, input?: Input },$store:Store): { speedX: number, speedY: number, velocityX: number, velocityY: number, direction?: directionString } => {

    // 速率
    let velocityX = 0;
    let velocityY = 0;

    // 速度
    let speedX = 0;
    let speedY = 0;

    // 方向
    let direction: directionString = NONE;

    // 点击鼠标左键, 会出现undefined
    if (undefined !== input) {
        // _prevInput || input用来保证deltaX等不会有undefined参与计算
        const _prevInput = prevInput || input;
        const deltaTime = input.timestamp - _prevInput.timestamp;
        // 每16ms刷新速度数据
        if (-1 === [INPUT_CANCEL, INPUT_END].indexOf(input.eventType) && (COMPUTE_INTERVAL < deltaTime || undefined === $store.get('direction'))) {
            const deltaX = input.x - _prevInput.x;
            const deltaY = input.y - _prevInput.y;
            speedX = Math.round(deltaX / deltaTime * 100) / 100;
            speedY = Math.round(deltaY / deltaTime * 100) / 100;
            velocityX = Math.abs(speedX);
            velocityY = Math.abs(speedY);
            direction = getDirection(deltaX, deltaY) || <directionString>($store.get('direction'));
            // 存储状态
            $store.set({ speedX });
            $store.set({ speedY });
            $store.set({ velocityX });
            $store.set({ velocityY });
            $store.set({ direction });
        } else {
            speedX = $store.get('speedX', 0);
            speedY = $store.get('speedY', 0);
            velocityX = $store.get('velocityX', 0);
            velocityY = $store.get('velocityY', 0);
            direction = $store.get('direction');
        }
    }

    return { velocityX, velocityY, speedX, speedY, direction };
};