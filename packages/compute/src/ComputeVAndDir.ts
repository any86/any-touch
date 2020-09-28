// 返回最近一个时间段的计算结果
// 默认间隔25ms做一次计算, 让数据更新,
// 让end阶段读取上一步的计算数据, 比如方向, 速率等...
// 防止快速滑动到慢速滑动的手势识别成swipe
import type { Input, InputOnlyHasCurrent } from '@any-touch/shared';
import { STAGE, COMPUTE_INTERVAL,DIRECTION } from '@any-touch/shared';
import { getDirection } from '@any-touch/vector';

function ComputeVAndDir() {
    let velocityX = 0;
    let velocityY = 0;
    let speedX = 0;
    let speedY = 0;
    let direction: DIRECTION;
    // 上一次发生计算时候参与计算的input
    let _lastValidInput: InputOnlyHasCurrent | Input

    /**
     * 计算速度和方向
     * 注意: 往复滑动会出现direction为undefined
     * @param input 输入
     */
    return function (input: Input): { speedX: number, speedY: number, velocityX: number, velocityY: number, direction?: DIRECTION } {
        // 点击鼠标左键, 会出现undefined
        if (void 0 !== input) {
            const { stage } = input;
            _lastValidInput = _lastValidInput || input.startInput;
            const deltaTime = input.timestamp - _lastValidInput.timestamp;

            // 每16ms刷新速度数据
            if (STAGE.MOVE === stage && COMPUTE_INTERVAL < deltaTime) {
                const deltaX = input.x - _lastValidInput.x;
                const deltaY = input.y - _lastValidInput.y;
                speedX = Math.round(deltaX / deltaTime * 100) / 100;
                speedY = Math.round(deltaY / deltaTime * 100) / 100;
                velocityX = Math.abs(speedX);
                velocityY = Math.abs(speedY);
                direction = getDirection(deltaX, deltaY) || direction;

                // if(NONE === direction) console.warn({deltaX,deltaY},input.id,_lastValidInput.id );

                _lastValidInput = input;
            }
        }
        return { velocityX, velocityY, speedX, speedY, direction };
    }
}
ComputeVAndDir._id = `__ComputeVAndDir__`;
export default ComputeVAndDir;