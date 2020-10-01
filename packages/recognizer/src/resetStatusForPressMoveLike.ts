import Recognizer from './index';
import {
    STATUS_POSSIBLE,
    STATUS_END,
    STATUS_CANCELLED,
    STATUS_FAILED, STATUS_RECOGNIZED
} from '@any-touch/shared'
export default function(recognizer: Recognizer) {
    // 重置status
    if (-1 !== [STATUS_END, STATUS_CANCELLED, STATUS_RECOGNIZED, STATUS_FAILED].indexOf(recognizer._$status)) {
        recognizer._$status = STATUS_POSSIBLE;
    };
}