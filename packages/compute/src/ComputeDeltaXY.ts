import { radianToAngle } from '@any-touch/vector';
import type { Input } from '@any-touch/shared';

export default function () {
    return function (input: Input): { deltaX: number, deltaY: number, deltaXYAngle: number } {
        const { prevInput } = input;
        let deltaX = 0;
        let deltaY = 0;
        // deltaX/Y与2者合位移的角度
        let deltaXYAngle = 0;

        // 计算deltaX/Y
        if (void 0 !== prevInput) {
            deltaX = input.x - prevInput.x;
            deltaY = input.y - prevInput.y;

            // deltaXYAngle
            if (0 !== deltaX || 0 !== deltaY) {
                const deltaXY = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));
                deltaXYAngle = Math.round(radianToAngle(Math.acos(Math.abs(deltaX) / deltaXY)));
            }
        }

        return { deltaX, deltaY, deltaXYAngle };
    }
}