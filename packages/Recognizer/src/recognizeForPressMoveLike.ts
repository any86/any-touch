import { Recognizer, CommonEmitFunction, Input } from '@any-touch/shared/types';
import {
    INPUT_CANCEL, INPUT_END, INPUT_MOVE
} from '@any-touch/shared/const';

import {
    STATUS_POSSIBLE,
    STATUS_START,
    STATUS_MOVE,
    STATUS_END,
    STATUS_CANCELLED,
    STATUS_RECOGNIZED
} from '@any-touch/shared/const'
import resetStatus from './resetStatusForPressMoveLike';

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



/**
 * 适用于大部分移动类型的手势, 
 * 如pan/rotate/pinch/swipe
 * @param {Input} 输入记录 
 */
export default function (recognizer: Recognizer, input: Input, emit: CommonEmitFunction): any {
    // 是否识别成功
    const isVaild = recognizer.test(input);
    resetStatus(recognizer);

    // 状态变化流程
    const { inputType } = input;

    recognizer.status = flow(isVaild, recognizer.status, inputType);
    const { computed } = recognizer;
    if (STATUS_CANCELLED === inputType) {
        emit(recognizer.options.name + INPUT_CANCEL, computed);
        return;
    }

    // 是否已识别
    recognizer.isRecognized = -1 < [STATUS_START, STATUS_MOVE, STATUS_END, STATUS_RECOGNIZED].indexOf(recognizer.status);

    // 识别后触发的事件
    if (isVaild) {
        // computed = recognizer.lockDirection(computed);
        emit(recognizer.options.name, computed);

        // panstart | panmove 等
        emit(recognizer.options.name + recognizer.status, computed);
    } else if (recognizer.isRecognized) {
        // panend等
        emit(recognizer.options.name + recognizer.status, computed);
    }
};