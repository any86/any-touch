import { radianToAngle } from '@any-touch/vector';
import { Store, InputRecord } from '@types';
export default function computeDeltaXY({
    prevInput,
    input
}: InputRecord, $store: Store): { deltaX: number, deltaY: number, deltaXYAngle: number } {
    // 每次事件触发时位移的变化
    let deltaX: number;
    let deltaY: number;
    // deltaX/Y与2者合位移的角度
    let deltaXYAngle: number = 0;

    // 计算deltaX/Y
    // if ('end' === input.eventType || 'start' === input.eventType) {
    if (undefined === prevInput) {
        deltaX = 0;
        deltaY = 0;
    } else {
        deltaX = input.x - prevInput.x;
        deltaY = input.y - prevInput.y;
    }

    // 计算deltaXAngle / deltaYAngle
    if (0 !== deltaX || 0 !== deltaY) {
        const deltaXY = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));
        deltaXYAngle = Math.round(radianToAngle(Math.acos(Math.abs(deltaX) / deltaXY)));
        $store.set({ deltaXYAngle });
    } else {
        deltaXYAngle = $store.get('deltaXYAngle', 0);
    }

    return { deltaX, deltaY, deltaXYAngle };
};