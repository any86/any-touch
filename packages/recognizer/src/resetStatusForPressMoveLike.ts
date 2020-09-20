import {
    RECOGNIZER_STATUS
} from '@any-touch/shared'

export default function (status: RECOGNIZER_STATUS) {
    // 重置status
    return [RECOGNIZER_STATUS.END, RECOGNIZER_STATUS.CANCELLED, RECOGNIZER_STATUS.RECOGNIZED, RECOGNIZER_STATUS.FAILED].includes(status) ? RECOGNIZER_STATUS.POSSIBLE : status;
}