
import session from './session';
import { InputComputed, AnyTouch } from './interface';
import { getCenter, getAngle, getVLength, getDirection } from './vector';
import { propX, propY } from './const';
import computeDeltaXY from './computeDeltaXY'
import computeLast from './computeLast'

export default function ({
    startInput,
    prevInput,
    input, validInput, startMultiInput
}: any): any {
    const { abs, round, max } = Math;
    const length = input.pointers.length;


    let computed: any = {
        // 起始到结束的偏移
        displacementX: 0,
        displacementY: 0,
        distanceX: 0,
        distanceY: 0,
        distance: 0,

        // 位移变化量
        deltaX: 0,
        deltaY: 0,
        absDeltaX: 0,
        absDeltaY: 0,

        //  速率
        velocityX: 0,
        velocityY: 0,
        maxVelocity: 0,

        // 时间
        duration: 0,

        // 旋转和缩放
        angle: 0,
        scale: 1,
        centerX: undefined, centerY: undefined,
        lastVelocityY: undefined, lastVelocityX: undefined
    };



    // ================== 单点 ==================
    // 有效点, 包含位置信息
    if (2 > length) {
        // 单指滑动计算
        computed.displacementX = round(validInput.pointers[0][propX] - startInput.pointers[0][propX]);
        computed.displacementY = round(validInput.pointers[0][propY] - startInput.pointers[0][propY]);
        computed.distanceX = abs(computed.displacementX);
        computed.distanceY = abs(computed.displacementY);
        computed.distance = round(getVLength({ x: computed.distanceX, y: computed.distanceY }));

        // 已消耗时间
        computed.duration = input.timestamp - startInput.timestamp;

        // 计算每次移动时产生的位移增量
        const deltaData = computeDeltaXY(validInput, prevInput);
        computed.deltaX = deltaData.deltaX;
        computed.deltaY = deltaData.deltaY;

        const velocityData = computeLast(deltaData);
        computed.lastVelocityX = velocityData.velocityX;
        computed.lastVelocityY = velocityData.velocityY;

        computed.absDeltaX = abs(computed.deltaX);
        computed.absDeltaY = abs(computed.deltaY);

        // 速率
        computed.velocityX = abs(computed.distanceX / computed.duration);
        computed.velocityY = abs(computed.distanceY / computed.duration);
        computed.maxVelocity = max(computed.velocityX, computed.velocityY);

        // 计算方向
        const direction: string = getDirection(computed.deltaX, computed.deltaY);
    }
    // ================== 多点 ==================
    else if (1 < prevInput.pointers.length) {
        const v0 = {
            x: prevInput.pointers[1][propX] - prevInput.pointers[0][propX],
            y: prevInput.pointers[1][propY] - prevInput.pointers[0][propY]
        };

        const v1 = {
            x: input.pointers[1][propX] - input.pointers[0][propX],
            y: input.pointers[1][propY] - input.pointers[0][propY]
        };

        computed.angle = getAngle(v1, v0);
        computed.scale = getVLength(v1) / getVLength(v0);


    };

    // 中心
    // const { x, y } = getCenter(input);
    // computed.centerX = x;
    // computed.centerY = y;

    // 出现过的最大触点数量
    if (session.isStart) {
        session.maxLength = 0;
    }
    if (0 === session.maxLength) {
        session.maxLength = length;
    } else {
        session.maxLength = max(session.maxLength, length);
    }

    return {
        ...input,
        length,
        maxLength: session.maxLength,
        ...computed
    };
};