import session from './session';
import { AnyPointers } from './interface';
import { getCenter, getAngle,getVLength } from './vector';


let angle=0;
let scale= 1;
export default function (input: AnyPointers) {
    const { abs,round } = Math;

    // 每次变化产生的偏移
    let deltaX, deltaY, absDeltaX, absDeltaY;

    // 起始到结束的偏移
    let offsetX = round(input.activePointers[0].pageX - input.startPointers[0].pageX);
    let offsetY = round(input.activePointers[0].pageY - input.startPointers[0].pageY);

    if (undefined !== input.prevPointers) {
        deltaX = round(input.activePointers[0].pageX - input.prevPointers[0].pageX);
        deltaY = round(input.activePointers[0].pageY - input.prevPointers[0].pageY);
        absDeltaX = abs(deltaX);
        absDeltaY = abs(deltaY);
    }

    // 时间
    const deltaTime = input.activeTime - input.startTime;
    const timestamp = Date.now();

    // 速度
    const velocityX = offsetX / deltaTime;
    const velocityY = offsetY / deltaTime;


    
    // 多点
    if (1 < input.length) {
        const v0 = {
            x: input.prevPointers[1].pageX - input.prevPointers[0].pageX,
            y: input.prevPointers[1].pageY - input.prevPointers[0].pageY
        };

        const v1 = {
            x: input.activePointers[1].pageX - input.activePointers[0].pageX,
            y: input.activePointers[1].pageY - input.activePointers[0].pageY
        };

        angle+= getAngle(v0, v1);
        scale*= getVLength(v1)/ getVLength(v0);
    }

// return {};
    // 中心
    const { x: centerX, y: centerY } = getCenter(input.activePointers);
    return {velocityX, velocityY,scale, angle, centerX, centerY, deltaX, deltaY, absDeltaX, absDeltaY, offsetX, offsetY, deltaTime, timestamp };
};