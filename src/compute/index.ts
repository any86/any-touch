
import { Computed, directionString } from '../interface';
import { getDirection } from '../vector';
import intervalCompute from './intervalCompute';
import computeDistance from './computeDistance';
import computeDeltaXY from './computeDeltaXY';
`import computeMaxLength from './computeMaxLength';
import computMulti from './computeMulti';

// 最大触点数
export default function ({
    startInput,
    prevInput,
    startMultiInput,
    input
}: any): Computed {

    // ========= 整体距离/位移=========
    const { displacementX, displacementY, distanceX, distanceY, distance } = computeDistance({
        startInput,
        input
    });

    // ========= 从isStart到isFinal为止的方向 =========
    const overallDirection = <directionString>getDirection(displacementX, displacementY);

    // ========= 已消耗时间 =========
    const deltaTime = input.timestamp - startInput.timestamp;

    // ========= 最近25ms内计算数据, 瞬时数据 =========
    const { velocityX, velocityY, speedX, speedY, direction } = intervalCompute({ input, prevInput });

    // ========= 中心点位移增量 =========
    let { deltaX, deltaY, deltaXYAngle } = computeDeltaXY({ input, prevInput });


    // ========= 多点计算 =========
    // 上一触点数大于1, 当前触点大于1
    // 连续第二次出现多点, 才能开始计算
    const { scale,
        deltaScale,
        angle,
        deltaAngle } = computMulti({
            startMultiInput,
            prevInput,
            input
        })


    return {
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
        maxPointLength: computeMaxLength(input)
    };
};