// 返回最近一个时间段的计算结果
// 默认间隔25ms做一次计算, 让数据更新,
// 让end阶段读取上一步的计算数据, 比如方向, 速率等...
// 防止快速滑动到慢速滑动的手势识别成swipe
import { Input } from '../interface';
import { COMPUTE_INTERVAL, INPUT_CANCEL,INPUT_END } from '../const';
import { getDirection } from '../vector';
// 上次采集的input
let _prevInput: Input;
// 上次采集时的瞬时速率
let _prevVelocityX: number;
let _prevVelocityY: number;
// 上次采集的方向
let _prevDirection: string;
// 上次采集的瞬时速度(矢量)
let _prevSpeedX: number;
let _prevSpeedY: number;


export default (input: Input): {speedX:number, speedY: number, velocityX: number, velocityY: number, direction?: string } => {
    // 速率
    let velocityX: number;
    let velocityY: number;

    // 速度
    let speedX: number;
    let speedY: number;

    // 方向
    let direction: string;

    // _prevInput || input用来保证deltaX等不会有undefined参与计算
    _prevInput = _prevInput || input;
    const deltaTime = input.timestamp - _prevInput.timestamp;
    // console.log({deltaTime})
    // 每25ms刷新速度数据
    if (-1 === [INPUT_CANCEL, INPUT_END].indexOf(input.eventType) && (COMPUTE_INTERVAL < deltaTime || undefined === _prevDirection)) {
        const deltaX = input.x - _prevInput.x;
        const deltaY =input.y - _prevInput.y;
// console.log({deltaX,deltaY})
        speedX = Math.round(deltaX / deltaTime * 100) / 100;
        speedY = Math.round(deltaY / deltaTime * 100) / 100;
        velocityX = Math.abs(speedX);
        velocityY = Math.abs(speedY);
        direction = getDirection(deltaX, deltaY) || _prevDirection;
        // 存储状态
        _prevSpeedX = speedX;
        _prevSpeedY = speedY;
        _prevVelocityX = velocityX;
        _prevVelocityY = velocityY;
        _prevDirection = direction;
        _prevInput = input;
    } else {
        speedX = _prevSpeedX || 0;
        speedY = _prevSpeedY || 0;
        velocityX = _prevVelocityX || 0;
        velocityY = _prevVelocityY || 0;
        direction = _prevDirection;
    }
    // console.log({velocityX,velocityY})
    return {velocityX, velocityY,speedX,speedY, direction };
};