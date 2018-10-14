import { Input } from '../interface';
let maxLength = 0;
export default ({ nativeEventType, pointerLength }: Input): number => {
    maxLength = Math.max(maxLength, pointerLength);
    if ('start' === nativeEventType) {
        maxLength = pointerLength;
    } else if ('end' === nativeEventType) {
        maxLength = Math.max(1, pointerLength);
    }
    return maxLength;
};