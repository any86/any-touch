import Recognizer from './index';
import {
    STATUS_POSSIBLE,
    STATUS_END,
    STATUS_CANCELLED,
    STATUS_FAILED, STATUS_RECOGNIZED
} from '@any-touch/shared'
export default function(recognizer: Recognizer) {
    // 重置status
    if ([STATUS_END, STATUS_CANCELLED, STATUS_RECOGNIZED, STATUS_FAILED].includes(recognizer.status)) {
        recognizer.status = STATUS_POSSIBLE;
    };
}