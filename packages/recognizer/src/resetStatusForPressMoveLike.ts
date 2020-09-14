import {
    STATUS_END,
    STATUS_CANCELLED,
    STATUS_FAILED, STATUS_RECOGNIZED, STATUS_POSSIBLE
} from '@any-touch/shared'
import type { RecognizerStatus } from '@any-touch/shared'

export default function (status: RecognizerStatus) {
    // 重置status
    return [STATUS_END, STATUS_CANCELLED, STATUS_RECOGNIZED, STATUS_FAILED].includes(status) ? STATUS_POSSIBLE : status;
}