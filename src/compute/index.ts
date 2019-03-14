
import { Computed, directionString } from '../interface';
import { getDirection, getCenter } from '../vector';
import computeLast from './computeLast';
import computeDistance from './computeDistance';
import computeDeltaXY from './computeDeltaXY';
import computeVector from './computeVector';
import computeScale from './computeScale';
import computeAngle from './computeAngle';
import computeMaxLength from './computeMaxLength';

let prevScale = 1;
let prevAngle = 0;

// 最大触点数
export default function ({
    startInput,
    prevInput,
    startMutliInput,
    input
}: any): Computed {
    // ========= 整体距离/位移=========
    const { displacementX, displacementY, distanceX, distanceY, distance } = computeDistance({
        startInput,
        input
    });

    // ========= 方向 =========
    const overallDirection = <directionString>getDirection(displacementX, displacementY);

    // ========= 已消耗时间 =========
    const deltaTime = input.timestamp - startInput.timestamp;

    // ========= 最近25ms内计算数据, 瞬时数据 =========
    const lastComputed = computeLast(input);
    const velocityX = lastComputed.velocityX;
    const velocityY = lastComputed.velocityY;
    const direction = <directionString>lastComputed.direction;


    // ========= 中心点位移增量 =========
    let { deltaX, deltaY, deltaXYAngle } = computeDeltaXY({ input, prevInput });


    // ========= 多点计算 =========
    // 上一触点数大于1, 当前触点大于1
    let scale = 1;
    let deltaScale = 0;
    let angle = 0;
    let deltaAngle = 0;
    if (undefined !== prevInput && 1 < prevInput.pointers.length && 1 < input.pointers.length) {
        // 2指形成的向量
        const startV = computeVector(startMutliInput);
        const prevV = computeVector(prevInput);
        const activeV = computeVector(input);
        // 计算缩放
        const scaling = computeScale({
            startV, activeV, prevV
        });
        scale = scaling.scale;
        deltaScale = scaling.deltaScale;

        // ========= 计算旋转角度 =========
        const rotation = computeAngle({ startV, prevV, activeV });
        angle = rotation.angle;
        deltaAngle = rotation.deltaAngle;
        prevAngle = angle;
        prevScale = scale;
    } else {
        scale = prevScale;
        deltaScale = 1;
        angle = prevAngle;
        deltaAngle = 0;
    }

    // ========= 最大触点数 =========
    return {
        ...input,
        velocityX,
        velocityY,
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
        maxpointLength: computeMaxLength(input)
    };
};