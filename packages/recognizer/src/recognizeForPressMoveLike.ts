import { CommonEmitFunction, Input } from '@any-touch/shared';
import Recognizer from './index';
import {
    INPUT_CANCEL, INPUT_END, INPUT_MOVE
} from '@any-touch/shared';

import {
    STATUS_POSSIBLE,
    STATUS_START,
    STATUS_MOVE,
    STATUS_END,
    STATUS_CANCELLED,
    STATUS_RECOGNIZED
} from '@any-touch/shared'
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
                // [INPUT_END]: STATUS_RECOGNIZED,
                // [INPUT_CANCEL]: STATUS_CANCELLED
            },
            [STATUS_START]: {
                [INPUT_MOVE]: STATUS_MOVE,
                [INPUT_END]: STATUS_END,
                [INPUT_CANCEL]: STATUS_CANCELLED
            },
            [STATUS_MOVE]: {
                [INPUT_MOVE]: STATUS_MOVE,
                [INPUT_END]: STATUS_END,
                [INPUT_CANCEL]: STATUS_CANCELLED
            }
        },
        // isVaild === false
        // 这个分支有STATUS_FAILED
        // 2020年1月30, 未看完, 有待商榷
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
 * @returns {Boolean} test是否通过
 */
export default function (recognizer: Recognizer, input: Input, emit: CommonEmitFunction): boolean {
    // 是否识别成功
    const isVaild = recognizer.test(input);
    // console.log({isVaild},input.inputType,recognizer.name)
    resetStatus(recognizer);

    // 状态变化流程
    const { inputType } = input;

    recognizer.status = flow(isVaild, recognizer.status, inputType);
    const { computed } = recognizer;

    // 是否已识别, 包含end
    recognizer.isRecognized = -1 < [STATUS_START, STATUS_MOVE, STATUS_END,STATUS_CANCELLED, STATUS_RECOGNIZED].indexOf(recognizer.status);


    const {name, status,isRecognized} = recognizer;
    // console.log({status,inputType,isRecognized,isVaild})
    
    // 识别后触发的事件
    if (isRecognized) {
        // panend等
        if(INPUT_END !== inputType){
            emit(name, computed);
        }
        // console.log(recognizer.name)
        emit(name + status, computed);
    }
    return isVaild;
};