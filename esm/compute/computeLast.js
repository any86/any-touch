import { COMPUTE_INTERVAL } from '../const';
import { getDirection } from '../vector';
let _prevInput;
let _prevVelocityX;
let _prevVelocityY;
let _prevDirection;
export default (input) => {
    let velocityX;
    let velocityY;
    let direction;
    _prevInput = _prevInput || input;
    const deltaTime = input.timestamp - _prevInput.timestamp;
    const deltaX = (0 < input.centerX) ? input.centerX - _prevInput.centerX : 0;
    const deltaY = (0 < input.centerY) ? input.centerY - _prevInput.centerY : 0;
    if (COMPUTE_INTERVAL < deltaTime) {
        velocityX = Math.abs(deltaX / deltaTime);
        velocityY = Math.abs(deltaY / deltaTime);
        direction = getDirection(deltaX, deltaY);
        _prevVelocityX = velocityX;
        _prevVelocityY = velocityY;
        _prevDirection = direction;
        _prevInput = input;
    }
    else {
        velocityX = _prevVelocityX || 0;
        velocityY = _prevVelocityY || 0;
        direction = _prevDirection || 'none';
    }
    const maxVelocity = Math.max(velocityX, velocityY);
    return { velocity: maxVelocity, velocityX, velocityY, direction };
};
