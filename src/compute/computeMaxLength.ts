import { Input } from '../interface';
let maxLength = 0;
export default ({ pointerLength, isFirst, isFinal }: Input): number => {
    if (isFirst) {
        maxLength = pointerLength;
    } else {
        maxLength = Math.max(maxLength, pointerLength);
    }
    return maxLength;
};