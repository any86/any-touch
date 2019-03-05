// 返回最近一个时间段的计算结果
// 默认间隔25ms做一次计算, 让数据更新,
// 让end阶段读取上一步的计算数据, 比如方向, 速率等...
// 防止快速滑动到慢速滑动的手势识别成swipe
import { Input } from '../interface';
import { COMPUTE_INTERVAL, INPUT_CANCEL } from '../const';
import { getDirection } from '../vector';
// 上次采集的input
let _prevInput: Input;
// 上次采集时的瞬时速度
let _prevVelocityX: number;
let _prevVelocityY: number;
// 上次采集的方向
let _prevDirection: string;

export default (input: Input): { velocityX: number, velocityY: number, direction?: string } => {
    // 速率
    let velocityX: number;
    let velocityY: number;
    // 方向
    let direction: string;

    // _prevInput || input用来保证deltaX等不会有undefined参与计算
    _prevInput = _prevInput || input;
    const deltaTime = input.timestamp - _prevInput.timestamp;
    const deltaX = (0 < input.x) ? input.x - _prevInput.x : 0;
    const deltaY = (0 < input.y) ? input.y - _prevInput.y : 0;
    // 每25ms刷新速度数据
    if (INPUT_CANCEL !== input.eventType && COMPUTE_INTERVAL < deltaTime || undefined === _prevDirection) {
        velocityX = Math.round(Math.abs(deltaX / deltaTime) * 100) / 100;
        velocityY = Math.round(Math.abs(deltaY / deltaTime) * 100) / 100;
        direction = getDirection(deltaX, deltaY) || _prevDirection;
        // 存储状态
        _prevVelocityX = velocityX;
        _prevVelocityY = velocityY;
        _prevDirection = direction;
        _prevInput = input;
    } else {
        velocityX = _prevVelocityX || 0;
        velocityY = _prevVelocityY || 0;
        direction = _prevDirection;
    }

    return {velocityX, velocityY, direction };
};