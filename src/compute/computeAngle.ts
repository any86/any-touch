import { getAngle } from '../vector';
export default function ({
    startV, prevV, activeV
}: any): { angle: number, deltaAngle: number } {
    const deltaAngle = getAngle(activeV, prevV);
    const angle = getAngle(activeV, startV);
    return { angle, deltaAngle };
};