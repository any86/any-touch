// 返回最近一个时间段的计算结果
// 默认间隔25ms做一次计算, 让数据更新,
// 让end阶段读取上一步的计算数据, 比如方向, 速率等...
// 防止快速滑动到慢速滑动的手势识别成swipe
import { Input } from '../interface';
import { COMPUTE_INTERVAL } from '../const';
import { getDirection } from '../vector';
// 上次采集的input
let _prevInput: Input;
// 上次采集时的瞬时速度
let _prevVelocityX: number;
let _prevVelocityY: number;
// 上次采集的方向
let _prevDirection: string;

export default (input: Input): { velocity: number, velocityX: number, velocityY: number, direction: string } => {
    // 速率
    let velocityX: number;
    let velocityY: number;
    // 方向
    let direction: string;

    // _prevInput || input用来保证start阶段也有prevInput, 当然这时等于input
    _prevInput = _prevInput || input;
    const deltaTime = input.timestamp - _prevInput.timestamp;
    const deltaX = (0 < input.centerX) ? input.centerX - _prevInput.centerX : 0;
    const deltaY = (0 < input.centerY) ? input.centerY - _prevInput.centerY : 0;

    // 每25ms刷新速度数据
    if (COMPUTE_INTERVAL < deltaTime) {
        velocityX = Math.abs(deltaX / deltaTime);
        velocityY = Math.abs(deltaY / deltaTime);
        direction = getDirection(deltaX, deltaY);
        // 存储状态
        _prevVelocityX = velocityX;
        _prevVelocityY = velocityY;
        _prevDirection = direction;
        _prevInput = input;
    } else {
        velocityX = _prevVelocityX || 0;
        velocityY = _prevVelocityY || 0;
        direction = _prevDirection || 'none';
    }
    // 取xy方向2者的最大值
    const maxVelocity = Math.max(velocityX, velocityY);
    return { velocity: maxVelocity, velocityX, velocityY, direction };
};