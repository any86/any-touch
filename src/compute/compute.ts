
import { Computed } from '../interface';
import {getDirection } from '../vector';
import computeLast from './computeLast';
import computeDistance from './computeDistance';
import computeDeltaXY from './computeDeltaXY';
import computeVector from './computeVector';
import computeScale from './computeScale';
import computeAngle from './computeAngle';


let maxLength: number = 0;
export default function ({
    nativeEventType,
    startInput,
    prevInput,
    startMutliInput,
    input
}: any): any {
    // 如果输入为空, 那么就计算了, 鼠标模式下, 点击了非元素部分, mouseup阶段会初选input为undefined
    if (undefined === input) return;
    const length = input.pointers.length;
    const { abs, max } = Math;

    let computed: any = {
        // 起始到结束的偏移
        displacementX: 0,
        displacementY: 0,
        distanceX: 0,
        distanceY: 0,
        distance: 0,

        // 位移变化量
        deltaX: undefined,
        deltaY: undefined,
        absDeltaX: 0,
        absDeltaY: 0,

        //  速率
        velocityX: 0,
        velocityY: 0,

        // 时间
        duration: 0,

        // 旋转和缩放
        angle: 0,
        deltaAngle:0,
        scale: 1,
        deltaScale: 1,

        lastVelocityY: undefined,
        lastVelocityX: undefined
    };

    // 滑动距离
    const { displacementX, displacementY, distanceX, distanceY, distance } = computeDistance({
        nativeEventType,
        startInput,
        input
    });
    computed = { ...computed, displacementX, displacementY, distanceX, distanceY, distance };

    // 计算方向
    computed.direction = getDirection(displacementX, displacementY);

    // 已消耗时间
    computed.duration = input.timestamp - startInput.timestamp;
    // 最近25ms内计算数据
    const lastComputed = computeLast(input);
    computed.lastVelocityX = lastComputed.velocityX;
    computed.lastVelocityY = lastComputed.velocityY;
    computed.lastVelocity = lastComputed.velocity;
    computed.lastDirection = lastComputed.direction;

    // 中心点位移增量
    let { deltaX, deltaY } = computeDeltaXY({ input, prevInput });
    computed.deltaX = deltaX;
    computed.deltaY = deltaY;

    // 时间增量
    if (undefined !== prevInput) {
        computed.deltaTime = input.timestamp - prevInput.timestamp;
    } else {
        computed.deltaTime = 0;
    }

    // 速率
    computed.velocityX = abs(computed.distanceX / computed.duration) || 0;
    computed.velocityY = abs(computed.distanceY / computed.duration) || 0;
    computed.maxVelocity = max(computed.velocityX, computed.velocityY);

    // 前面有判断, 如果出现了单触点, 那么startMutliInput === undefined;
    // if (undefined !== startMutliInput) {
    if (undefined !== prevInput && 1 < prevInput.pointers.length && 1 < input.pointers.length) {
        // 2指形成的向量
        const startV = computeVector(startMutliInput);
        const prevV = computeVector(prevInput);
        const activeV = computeVector(input);

        // 计算缩放
        const { scale, deltaScale } = computeScale({
            startV, prevV, activeV
        });
        computed.scale = scale;
        computed.deltaScale = deltaScale;

        // 计算旋转角度
        const { angle, deltaAngle } = computeAngle({ startV, prevV, activeV });
        computed.angle = angle;
        computed.deltaAngle = deltaAngle;
    }


    maxLength = max(maxLength, length);
    if ('start' === nativeEventType) {
        maxLength = length;
    } else if ('end' === nativeEventType) {
        maxLength = Math.max(1, length);
    }


    return {
        ...input,
        length,
        maxLength,
        ...computed
    };
};