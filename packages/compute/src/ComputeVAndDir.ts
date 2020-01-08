// 返回最近一个时间段的计算结果
// 默认间隔25ms做一次计算, 让数据更新,
// 让end阶段读取上一步的计算数据, 比如方向, 速率等...
// 防止快速滑动到慢速滑动的手势识别成swipe
import { Input, PureInput, directionString } from '@types';
import { COMPUTE_INTERVAL, INPUT_MOVE } from '@any-touch/const';
import { getDirection } from '@any-touch/vector';

export default class ComputeVAndDir {
    velocityX = 0;
    velocityY = 0;
    speedX = 0;
    speedY = 0;
    direction?: directionString;
    // 上一次发生计算时候参与计算的input
    private _lastValidInput?: PureInput | Input

    /**
     * 计算
     * 往复滑动会出现direction为none
     * @param {Input} 输入
     */
    compute(input: Input): { speedX: number, speedY: number, velocityX: number, velocityY: number, direction?: directionString } {
        // 点击鼠标左键, 会出现undefined
        if (void 0 !== input) {
            const { inputType } = input;
            this._lastValidInput = this._lastValidInput || input.startInput;
            const deltaTime = input.timestamp - this._lastValidInput.timestamp;


            // 每16ms刷新速度数据
            if (INPUT_MOVE === inputType && COMPUTE_INTERVAL < deltaTime) {
                const deltaX = input.x - this._lastValidInput.x;
                const deltaY = input.y - this._lastValidInput.y;
                this.speedX = Math.round(deltaX / deltaTime * 100) / 100;
                this.speedY = Math.round(deltaY / deltaTime * 100) / 100;
                this.velocityX = Math.abs(this.speedX);
                this.velocityY = Math.abs(this.speedY);
                this.direction = getDirection(deltaX, deltaY) || <directionString>(this.direction);

                // if(NONE === this.direction) console.warn({deltaX,deltaY},input.id,this._lastValidInput.id );

                this._lastValidInput = input;
            }
        }
        const { velocityX, velocityY, speedX, speedY, direction } = this;

        return { velocityX, velocityY, speedX, speedY, direction };
    }
}


type A = keyof ComputeVAndDir