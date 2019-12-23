import { Recognizer, directionString, Input } from '@types';
import {
    INPUT_CANCEL, INPUT_END, INPUT_MOVE, DIRECTION_X, DIRECTION_Y, NONE, STATUS_POSSIBLE,
    STATUS_START,
    STATUS_MOVE,
    STATUS_END,
    STATUS_CANCELLED,
    STATUS_FAILED, STATUS_RECOGNIZED
} from '@const';

function flow(isVaild: boolean, activeStatus: string, inputType: string): string {
    const STATE_MAP: { [k: number]: any } = {
        // isVaild === true,
        // Number(true) === 1
        // 这个分支不会出现STATUS_FAILED
        // STATUS_END在上面的代码中也会被重置为STATUS_POSSIBLE, 从而进行重新识别
        1: {
            [STATUS_POSSIBLE]: {
                [INPUT_MOVE]: STATUS_START,
                [INPUT_END]: STATUS_RECOGNIZED,
                [INPUT_CANCEL]: STATUS_CANCELLED
            },
            [STATUS_START]: {
                [INPUT_MOVE]: STATUS_MOVE,
                [INPUT_END]: STATUS_END,
                [INPUT_CANCEL]: STATUS_CANCELLED
            },
            [STATUS_MOVE]: {
                [INPUT_MOVE]: STATUS_MOVE,
                [INPUT_END]: STATUS_END,
            }
        },
        // isVaild === false
        // 这个分支有STATUS_FAILED
        0: {
            [STATUS_START]: {
                [INPUT_MOVE]: STATUS_CANCELLED,
                [INPUT_END]: STATUS_END,
                [INPUT_CANCEL]: STATUS_CANCELLED
            },
            [STATUS_MOVE]: {
                [INPUT_MOVE]: STATUS_CANCELLED,
                [INPUT_END]: STATUS_END,
                [INPUT_CANCEL]: STATUS_CANCELLED
            }
        }
    };
    if (void 0 !== STATE_MAP[Number(isVaild)][activeStatus]) {
        return STATE_MAP[Number(isVaild)][activeStatus][inputType] || activeStatus;
    } else {
        return activeStatus;
    }
};

export function resetStatus(recognizer: any) {
    // 重置status
    if (-1 !== [STATUS_END, STATUS_CANCELLED, STATUS_RECOGNIZED, STATUS_FAILED].indexOf(recognizer.status)) {
        recognizer.status = STATUS_POSSIBLE;
    };
}

/**
 * 适用于大部分移动类型的手势, 
 * 如pan/rotate/pinch/swipe
 * @param {Input} 输入记录 
 */
export default function (recognizer: any, input: Input, callback: (type:string,...payload: any[]) => void): void {
    // 是否识别成功
    const isVaild = recognizer.test(input);

    resetStatus(recognizer);


    // 状态变化流程
    const { inputType } = input;

    recognizer.status = flow(isVaild, recognizer.status, inputType);
    const { event } = recognizer;
    if (STATUS_CANCELLED === inputType) {
        callback(recognizer.options.name + INPUT_CANCEL, event);
        return;
    }

    // 是否已识别
    recognizer.isRecognized = -1 < [STATUS_START, STATUS_MOVE, STATUS_END, STATUS_RECOGNIZED].indexOf(recognizer.status);
    // 识别后触发的事件
    if (isVaild) {
        recognizer.afterRecognized(event);

        // computed = recognizer.lockDirection(computed);
        callback(recognizer.options.name, event);

        // panstart | panmove 等
        callback(recognizer.options.name + recognizer.status, event);

        recognizer.afterEmit();
    } else if (recognizer.isRecognized) {

        // panend等
        callback(recognizer.options.name + recognizer.status, event);

    }
};