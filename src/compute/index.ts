
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
}: any): Computed{
    const { abs, max } = Math;
    let computed = <Computed>{};

    // 滑动距离
    const { displacementX, displacementY, distanceX, distanceY, distance } = computeDistance({
        startInput,
        input
    });

    computed = { ...computed, displacementX, displacementY, distanceX, distanceY, distance };

    // 计算方向
    computed.direction = <directionString>getDirection(displacementX, displacementY);

    // 已消耗时间
    computed.deltaTime = input.timestamp - startInput.timestamp;
    // 最近25ms内计算数据
    const lastComputed = computeLast(input);
    computed.velocityX = lastComputed.velocityX;
    computed.velocityY = lastComputed.velocityY;
    computed.lastDirection = <directionString>lastComputed.direction;
    // 中心点位移增量
    let { deltaX, deltaY, deltaXYAngle } = computeDeltaXY({ input, prevInput });
    computed.deltaX = deltaX;
    computed.deltaY = deltaY;
    computed.deltaXYAngle = deltaXYAngle;

    // 时间增量
    if (undefined !== prevInput) {
        computed.deltaTime = input.timestamp - prevInput.timestamp;
    } else {
        computed.deltaTime = 0;
    }

    // 多点计算
    // 上一触点数大于1, 当前触点大于1
    if (undefined !== prevInput && 1 < prevInput.pointers.length && 1 < input.pointers.length) {
        // 2指形成的向量
        const startV = computeVector(startMutliInput);
        const prevV = computeVector(prevInput);
        const activeV = computeVector(input);
        // 计算缩放
        const { deltaScale, scale } = computeScale({
            startV, activeV, prevV
        });
        computed.scale = scale;
        computed.deltaScale = deltaScale;

        // 计算旋转角度
        const { angle, deltaAngle } = computeAngle({ startV, prevV, activeV });
        computed.angle = angle;
        computed.deltaAngle = deltaAngle;
        prevAngle = angle;
        prevScale = scale;
    } else {
        computed.scale = prevScale;
        computed.deltaScale = 1;
        computed.angle = prevAngle;
        computed.deltaAngle = 0;
    }

    // 最大触点数
    const maxPointerLength = computeMaxLength(input);
    computed = { ...computed, ...input, maxPointerLength };
    return computed;
};