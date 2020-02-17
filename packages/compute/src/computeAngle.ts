import { Vector,round2 } from '@any-touch/shared';
import {getAngle} from '@any-touch/vector';
export default function({
    startV, prevV, activeV
}: Record<string,Vector>): { angle: number, deltaAngle: number } {
    const deltaAngle = Math.round(getAngle(activeV, prevV));
    const angle = Math.round(getAngle(activeV, startV));
    return { angle, deltaAngle };
};