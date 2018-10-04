
import { Computed } from '../interface';
import { getAngle, getVLength, getDirection } from '../vector';
import { propX, propY } from '../const';
import computeLast from './computeLast';
import computeDistance from './computeDistance';
import computeDeltaXY from './computeDeltaXY';

let maxLength: number = 0;
export default function ({
    nativeEventType,
    startInput,
    prevInput,
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
        scale: 1,
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
    computed.velocityX = abs(computed.distanceX / computed.duration);
    computed.velocityY = abs(computed.distanceY / computed.duration);
    computed.maxVelocity = max(computed.velocityX, computed.velocityY);

    // ================== 多触点 ==================
    if (undefined !== prevInput && 1 < prevInput.pointers.length && 1 < input.pointers.length) {
        const v0 = {
            x: prevInput.pointers[1][propX] - prevInput.pointers[0][propX],
            y: prevInput.pointers[1][propY] - prevInput.pointers[0][propY]
        };

        const v1 = {
            x: input.pointers[1][propX] - input.pointers[0][propX],
            y: input.pointers[1][propY] - input.pointers[0][propY]
        };

        // 缩放增量
        computed.scale = getVLength(v1) / getVLength(v0);

        // 角度增量
        computed.angle = getAngle(v1, v0);
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