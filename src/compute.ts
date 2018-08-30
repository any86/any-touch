import session from './session';
import { AnyTouchEvent, AnyInput } from './interface';
import { getCenter, getAngle, getVLength } from './vector';


export default function (input: AnyInput): AnyTouchEvent {
    const { abs, round, max } = Math;
    
    // 每次变化产生的偏移
    let deltaX, deltaY, absDeltaX, absDeltaY;

    // 起始到结束的偏移
    let displacementX = round(input.activePointers[0].pageX - input.startPointers[0].pageX);
    let displacementY = round(input.activePointers[0].pageY - input.startPointers[0].pageY);
    let distanceX = abs(displacementX);
    let distanceY = abs(displacementY);




    if (undefined !== input.prevPointers) {
        deltaX = round(input.activePointers[0].pageX - input.prevPointers[0].pageX);
        deltaY = round(input.activePointers[0].pageY - input.prevPointers[0].pageY);
        absDeltaX = abs(deltaX);
        absDeltaY = abs(deltaY);
    }

    // 从start到end的时间
    const duration = input.activeTime - input.startTime;

    // 速率
    const velocityX = abs(displacementX / duration);
    const velocityY = abs(displacementY / duration);
    const maxVelocity = max(velocityX, velocityY);
    // 多点
    let angle = 0;
    let scale = 1;
    if (1 < input.length) {
        const v0 = {
            x: input.prevPointers[1].pageX - input.prevPointers[0].pageX,
            y: input.prevPointers[1].pageY - input.prevPointers[0].pageY
        };

        const v1 = {
            x: input.activePointers[1].pageX - input.activePointers[0].pageX,
            y: input.activePointers[1].pageY - input.activePointers[0].pageY
        };

        angle = getAngle(v0, v1);
        scale = getVLength(v1) / getVLength(v0);
    }

    // 中心
    const { x: centerX, y: centerY } = getCenter(input.activePointers);

    session.velocityX = velocityX;
    session.velocityY = velocityY;
    session.maxVelocity = maxVelocity;
    session.scale = scale;
    session.angle = angle;
    session.centerX = centerX;
    session.centerY = centerY;
    session.deltaX = deltaX;
    session.deltaY = deltaY;
    session.absDeltaX = absDeltaX;
    session.absDeltaY = absDeltaY;
    session.displacementX = displacementX;
    session.displacementY = displacementY;
    session.distanceX = distanceX;
    session.distanceY = distanceY;
    session.duration = duration;

    return {
        type: 'anytouch',
        velocityX,
        velocityY,
        maxVelocity,
        scale,
        angle,
        centerX,
        centerY,
        deltaX,
        deltaY,
        absDeltaX,
        absDeltaY,
        displacementX,
        displacementY,
        distanceX,
        distanceY,
        duration
    };
};