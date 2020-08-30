import type { Vector } from '@any-touch/shared';
import { getAngle } from '@any-touch/vector';
/**
 * 计算角度
 * @param  vectors startV, prevV, activeV 3个阶段向量
 */
export default function ({
    startV, prevV, activeV
}: { startV: Vector, prevV: Vector, activeV: Vector }): { angle: number, deltaAngle: number } {
    const deltaAngle = Math.round(getAngle(activeV, prevV));
    const angle = Math.round(getAngle(activeV, startV));
    return { angle, deltaAngle };
};