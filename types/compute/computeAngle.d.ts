import { Vector } from '../interface';
export default function ({ startV, prevV, activeV }: Record<string, Vector>): {
    angle: number;
    deltaAngle: number;
};
