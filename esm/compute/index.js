import { getDirection } from '../vector';
import computeLast from './computeLast';
import computeDistance from './computeDistance';
import computeDeltaXY from './computeDeltaXY';
import computeVector from './computeVector';
import computeScale from './computeScale';
import computeAngle from './computeAngle';
import computeMaxLength from './computeMaxLength';
export default function ({ startInput, prevInput, startMutliInput, input }) {
    if (undefined === input)
        return;
    const length = input.pointers.length;
    const { abs, max } = Math;
    let computed = {
        displacementX: 0,
        displacementY: 0,
        distanceX: 0,
        distanceY: 0,
        distance: 0,
        direction: 'none',
        lastDirection: 'none',
        deltaX: undefined,
        deltaY: undefined,
        velocityX: 0,
        velocityY: 0,
        maxVelocity: 0,
        duration: 0,
        angle: 0,
        deltaAngle: 0,
        scale: 1,
        deltaScale: 1,
        lastVelocity: undefined,
        lastVelocityY: undefined,
        lastVelocityX: undefined
    };
    const { displacementX, displacementY, distanceX, distanceY, distance } = computeDistance({
        startInput,
        input
    });
    computed = Object.assign({}, computed, { displacementX, displacementY, distanceX, distanceY, distance });
    computed.direction = getDirection(displacementX, displacementY);
    computed.duration = input.timestamp - startInput.timestamp;
    const lastComputed = computeLast(input);
    computed.lastVelocityX = lastComputed.velocityX;
    computed.lastVelocityY = lastComputed.velocityY;
    computed.lastVelocity = lastComputed.velocity;
    computed.lastDirection = lastComputed.direction;
    let { deltaX, deltaY } = computeDeltaXY({ input, prevInput });
    computed.deltaX = deltaX;
    computed.deltaY = deltaY;
    if (undefined !== prevInput) {
        computed.deltaTime = input.timestamp - prevInput.timestamp;
    }
    else {
        computed.deltaTime = 0;
    }
    computed.velocityX = abs(computed.distanceX / computed.duration) || 0;
    computed.velocityY = abs(computed.distanceY / computed.duration) || 0;
    computed.maxVelocity = max(computed.velocityX, computed.velocityY);
    if (undefined !== prevInput && 1 < prevInput.pointers.length && 1 < input.pointers.length) {
        const startV = computeVector(startMutliInput);
        const prevV = computeVector(prevInput);
        const activeV = computeVector(input);
        const { scale, deltaScale } = computeScale({
            startV, prevV, activeV
        });
        computed.scale = scale;
        computed.deltaScale = deltaScale;
        const { angle, deltaAngle } = computeAngle({ startV, prevV, activeV });
        computed.angle = angle;
        computed.deltaAngle = deltaAngle;
    }
    const maxLength = computeMaxLength(input);
    return Object.assign({}, input, { length,
        maxLength }, computed);
}
;
