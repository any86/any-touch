import { radianToAngle } from '../vector';
let lastDeltaXAngle = 0;
let lastDeltaYAngle = 0;
export default function ({
    prevInput,
    input
}: any): { deltaX: number, deltaY: number, deltaXAngle: number, deltaYAngle: number } {
    // 每次事件触发时位移的变化
    let deltaX: number;
    let deltaY: number;
    // deltaX/Y与2者合位移的角度
    let deltaXAngle: number = 0;
    let deltaYAngle: number = 0;

    // 计算deltaX/Y
    if ('end' === input.inputStatus || 'start' === input.inputStatus) {
        deltaX = 0;
        deltaY = 0;
    } else {
        deltaX = input.centerX - prevInput.centerX;
        deltaY = input.centerY - prevInput.centerY;
    }


    // 计算deltaXAngle / deltaYAngle
    if (0 !== deltaX || 0 !== deltaY) {
        const deltaXY = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));
        deltaXAngle = Math.round(radianToAngle(Math.acos(deltaX / deltaXY)));
        deltaYAngle = Math.round(radianToAngle(Math.acos(deltaY / deltaXY)));
        lastDeltaXAngle = deltaXAngle;
        lastDeltaYAngle = deltaYAngle;
    } else {
        deltaXAngle = lastDeltaXAngle;
        deltaYAngle = lastDeltaYAngle;
    }

    return { deltaX, deltaY, deltaXAngle, deltaYAngle };
};