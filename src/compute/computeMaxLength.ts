import { Input } from '../interface';
let maxLength = 0;
export default ({ pointLength, isFirst, isFinal }: Input): number => {
    if (isFirst) {
        maxLength = pointLength;
    } else {
        maxLength = Math.max(maxLength, pointLength);
    }
    return maxLength;
};