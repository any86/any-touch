// 返回最近一个时间段的计算结果
// 默认间隔25ms做一次计算, 让数据更新,
// 让end阶段读取上一步的计算数据, 比如方向, 速率等...
// 防止快速滑动到慢速滑动的手势识别成swipe
import type { Input, InputOnlyHasCurrent, directionString } from '@any-touch/shared';
import { COMPUTE_INTERVAL } from '@any-touch/shared';
import { getDirection } from '@any-touch/vector';

export default function () {
    let velocityX = 0;
    let velocityY = 0;
    let speedX = 0;
    let speedY = 0;
    let direction: directionString;
    // 上一次发生计算时候参与计算的input
    let lastValidInput: InputOnlyHasCurrent | Input
    /**
     * 计算速度和方向
     * 注意: 往复滑动会出现direction为none
     * @param input 输入
     */
    return function (input: Input) {
        // 点击鼠标左键, 会出现undefined
        if (void 0 !== input) {
            // const { phase } = input;
            lastValidInput = lastValidInput || input.startInput;
            const deltaTime = input.timestamp - lastValidInput.timestamp;
            // 间隔超过16ms刷新速度数据
            if (COMPUTE_INTERVAL < deltaTime) {
                const deltaX = input.x - lastValidInput.x;
                const deltaY = input.y - lastValidInput.y;
                speedX = Math.round(deltaX / deltaTime * 100) / 100;
                speedY = Math.round(deltaY / deltaTime * 100) / 100;
                velocityX = Math.abs(speedX);
                velocityY = Math.abs(speedY);
                direction = getDirection(deltaX, deltaY) || direction;
                // if(NONE === direction) console.warn({deltaX,deltaY},input.id,_lastValidInput.id );
                lastValidInput = input;
            }
            // console.warn(deltaTime,input.phase,velocityX, velocityY);

        }
        return { velocityX, velocityY, speedX, speedY, direction};

        // console.log({velocityX, velocityY});
        // return { velocityX, velocityY, speedX, speedY, direction, vPointLengh: lastValidInput.pointLength };
    }
}
