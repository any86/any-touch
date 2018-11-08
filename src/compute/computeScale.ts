import { getVLength } from '../vector';

export default function ({
    startV, activeV
}: any): number {
    return getVLength(activeV) / getVLength(startV);
};