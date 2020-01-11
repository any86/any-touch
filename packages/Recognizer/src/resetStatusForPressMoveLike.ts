import { Recognizer} from '@types';
import {
    STATUS_POSSIBLE,
    STATUS_END,
    STATUS_CANCELLED,
    STATUS_FAILED, STATUS_RECOGNIZED
} from '@any-touch/shared/const'
export default function(recognizer: Recognizer) {
    // 重置status
    if (-1 !== [STATUS_END, STATUS_CANCELLED, STATUS_RECOGNIZED, STATUS_FAILED].indexOf(recognizer.status)) {
        recognizer.status = STATUS_POSSIBLE;
    };
}