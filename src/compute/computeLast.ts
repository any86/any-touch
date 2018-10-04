// 返回最近一个时间段的计算结果
// 默认间隔25ms做一次计算, 让数据更新,
// 让end阶段读取上一步的计算数据, 比如方向, 速率等...
// 防止快速滑动到慢速滑动的手势识别成swipe
import { AnyInput } from '../interface';
import { COMPUTE_INTERVAL } from '../const';
import { getDirection } from '../vector';
// 上次采集的input
let _prevInput: AnyInput;
// 上次采集时的瞬时速度
let _prevVelocityX: number;
let _prevVelocityY: number;

export default (input: AnyInput): { maxVelocity: number, velocityX: number, velocityY: number, direction: string } => {
    // 速度
    let velocityX: number;
    let velocityY: number;
    _prevInput = _prevInput || input;
    const deltaTime = input.timestamp - _prevInput.timestamp;
    const deltaX = input.centerX - _prevInput.centerX;
    const deltaY = input.centerY - _prevInput.centerY;

    if (COMPUTE_INTERVAL < deltaTime) {
        _prevVelocityX = velocityX = deltaX / deltaTime || 0;
        _prevVelocityY = velocityY = deltaY / deltaTime || 0;
        _prevInput = input;
    } else {
        velocityX = _prevVelocityX || 0;
        velocityY = _prevVelocityY || 0;
    }
    // 取xy方向2者的最大值
    const maxVelocity = Math.max(velocityX, velocityY);

    // 方向
    const direction = getDirection(deltaX, deltaY);

    return { maxVelocity, velocityX, velocityY, direction };
};