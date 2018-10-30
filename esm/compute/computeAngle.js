import { getAngle } from '../vector';
export default function ({ startV, prevV, activeV }) {
    const deltaAngle = getAngle(activeV, prevV);
    const angle = getAngle(activeV, startV);
    return { angle, deltaAngle };
}
;
