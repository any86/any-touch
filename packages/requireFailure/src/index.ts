import { STATUS_FAILED, STATUS_POSSIBLE } from '@any-touch/shared';
import AnyTouch from '@any-touch/core';
import Recognizer from '@any-touch/recognizer';
type ReturnFunction = (anyTouch: AnyTouch, recognizer: Recognizer, next: () => boolean) => void;

export default (recognizerName: string, requireFailureRecognizerNames: string[], waitTime = 300): ReturnFunction =>
    // 返回any-touch可以处理的函数
    (anyTouch: AnyTouch, recognizer: Recognizer, next: () => boolean) => {
        const { name } = recognizer;
        if (recognizerName === name) {

            // 过指定时间后去检查指定手势是否失败状态
            ; (setTimeout as Window['setTimeout'])(() => {
                if (requireFailureRecognizerNames.every(name => {
                    // console.log(anyTouch.recognizerMap[name].status)
                    return [STATUS_POSSIBLE, STATUS_FAILED].includes(anyTouch.recognizerMap[name].status);
                })) {
                    next();
                }
            }, waitTime);
        } else {
            next();
        }
    };