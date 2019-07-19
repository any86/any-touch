
import { Computed, Input, directionString,InputRecord } from '../interface';
import { getDirection } from '../vector';
import intervalCompute from './intervalCompute';
import computeDistance from './computeDistance';
import computeDeltaXY from './computeDeltaXY';
import computeMaxLength from './computeMaxLength';
import computMulti from './computeMulti';

// 最大触点数
export default function (inputs: InputRecord): Computed {
    const { input } = inputs;
    // ========= 整体距离/位移=========
    const { displacementX, displacementY, distanceX, distanceY, distance, overallDirection } = computeDistance(inputs);

    // ========= 已消耗时间 =========
    const deltaTime = inputs.input.timestamp - inputs.startInput.timestamp;

    // ========= 最近25ms内计算数据, 瞬时数据 =========
    const { velocityX, velocityY, speedX, speedY, direction } = intervalCompute(inputs);

    // ========= 中心点位移增量 =========
    const { deltaX, deltaY, deltaXYAngle } = computeDeltaXY(inputs);


    // ========= 多点计算 =========
    // 上一触点数大于1, 当前触点大于1
    // 连续第二次出现多点, 才能开始计算
    const { scale,
        deltaScale,
        angle,
        deltaAngle } = computMulti(inputs);

    const maxPointLength = computeMaxLength(input);
    return {
        type: '',
        ...input,
        velocityX,
        velocityY,
        speedX,
        speedY,
        deltaTime,
        overallDirection,
        direction,
        deltaX, deltaY, deltaXYAngle,
        displacementX,
        displacementY,
        distanceX,
        distanceY,
        distance,
        scale,
        deltaScale,
        angle,
        deltaAngle,
        maxPointLength 
    };
};