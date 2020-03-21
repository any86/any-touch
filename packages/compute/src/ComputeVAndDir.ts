// 返回最近一个时间段的计算结果
// 默认间隔25ms做一次计算, 让数据更新,
// 让end阶段读取上一步的计算数据, 比如方向, 速率等...
// 防止快速滑动到慢速滑动的手势识别成swipe
import type { Input, PureInput, directionString } from '@any-touch/shared';
import { INPUT_MOVE, COMPUTE_INTERVAL } from '@any-touch/shared';
import { getDirection } from '@any-touch/vector';

function ComputeVAndDir() {
    let velocityX = 0;
    let velocityY = 0;
    let speedX = 0;
    let speedY = 0;
    let direction: directionString;
    // 上一次发生计算时候参与计算的input
    let _lastValidInput: PureInput | Input

    /**
     * 计算
     * 往复滑动会出现direction为none
     * @param {Input} 输入
     */
    return function (input: Input): { speedX: number, speedY: number, velocityX: number, velocityY: number, direction?: directionString } {
        // 点击鼠标左键, 会出现undefined
        if (void 0 !== input) {
            const { inputType } = input;
            _lastValidInput = _lastValidInput || input.startInput;
            const deltaTime = input.timestamp - _lastValidInput.timestamp;


            // 每16ms刷新速度数据
            if (INPUT_MOVE === inputType && COMPUTE_INTERVAL < deltaTime) {
                const deltaX = input.x - _lastValidInput.x;
                const deltaY = input.y - _lastValidInput.y;
                speedX = Math.round(deltaX / deltaTime * 100) / 100;
                speedY = Math.round(deltaY / deltaTime * 100) / 100;
                velocityX = Math.abs(speedX);
                velocityY = Math.abs(speedY);
                direction = getDirection(deltaX, deltaY) || <directionString>(direction);

                // if(NONE === direction) console.warn({deltaX,deltaY},input.id,_lastValidInput.id );

                _lastValidInput = input;
            }
        }
        return { velocityX, velocityY, speedX, speedY, direction };
    }
}
ComputeVAndDir._id = `ComputeVAndDir`;
export default ComputeVAndDir;
// export default class {
//     static _id='ComputeVAndDir';
//     velocityX = 0;
//     velocityY = 0;
//     speedX = 0;
//     speedY = 0;
//     direction?: directionString;
//     // 上一次发生计算时候参与计算的input
//     private _lastValidInput?: PureInput | Input

//     /**
//      * 计算
//      * 往复滑动会出现direction为none
//      * @param {Input} 输入
//      */
//     compute(input: Input): { speedX: number, speedY: number, velocityX: number, velocityY: number, direction?: directionString } {
//         // 点击鼠标左键, 会出现undefined
//         if (void 0 !== input) {
//             const { inputType } = input;
//             this._lastValidInput = this._lastValidInput || input.startInput;
//             const deltaTime = input.timestamp - this._lastValidInput.timestamp;


//             // 每16ms刷新速度数据
//             if (INPUT_MOVE === inputType && COMPUTE_INTERVAL < deltaTime) {
//                 const deltaX = input.x - this._lastValidInput.x;
//                 const deltaY = input.y - this._lastValidInput.y;
//                 this.speedX = Math.round(deltaX / deltaTime * 100) / 100;
//                 this.speedY = Math.round(deltaY / deltaTime * 100) / 100;
//                 this.velocityX = Math.abs(this.speedX);
//                 this.velocityY = Math.abs(this.speedY);
//                 this.direction = getDirection(deltaX, deltaY) || <directionString>(this.direction);

//                 // if(NONE === this.direction) console.warn({deltaX,deltaY},input.id,this._lastValidInput.id );

//                 this._lastValidInput = input;
//             }
//         }
//         const { velocityX, velocityY, speedX, speedY, direction } = this;

//         return { velocityX, velocityY, speedX, speedY, direction };
//     }
// }