import { CommonEmitFunction, Input, STATUS_FAILED ,SupportStatus} from '@any-touch/shared';
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
    INPUT_START
} from '@any-touch/shared'
import resetStatus from './resetStatusForPressMoveLike';

function flow(isVaild: boolean, activeStatus: SupportStatus, stage: string): SupportStatus {
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
                // [INPUT_START]: STATUS_FAILED,
                [INPUT_MOVE]: STATUS_CANCELLED,
                [INPUT_END]: STATUS_END,
                [INPUT_CANCEL]: STATUS_CANCELLED
            },
            [STATUS_MOVE]: {
                [INPUT_START]: STATUS_FAILED,
                [INPUT_MOVE]: STATUS_CANCELLED,
                [INPUT_END]: STATUS_END,
                [INPUT_CANCEL]: STATUS_CANCELLED
            }
        }
    };
    if (void 0 !== STATE_MAP[Number(isVaild)][activeStatus]) {
        return STATE_MAP[Number(isVaild)][activeStatus][stage] || activeStatus;
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
    // console.log({isVaild},input.stage,recognizer.name)
    resetStatus(recognizer);

    // 状态变化流程
    const { stage } = input;

    recognizer.status = flow(isVaild, recognizer.status, stage);
    const { computed } = recognizer;

    // 是否已识别, 包含end
    recognizer.isRecognized = ([STATUS_START, STATUS_MOVE] as SupportStatus[]).includes(recognizer.status);

    const { name, status, isRecognized } = recognizer;
    // if('pan' == name) console.warn(status,stage,{isRecognized,isVaild},input.pointLength)
    // 识别后触发的事件
    if (isRecognized) {
        emit(name, computed);
    }
    // if('pan' == recognizer.name){
    //     console.log(isRecognized,recognizer.name)
    // }
    if (isRecognized || ([STATUS_END, STATUS_CANCELLED] as SupportStatus[]).includes(recognizer.status)) {
        // console.log(name + status,computed.deltaX )
        emit(name + status, computed);
    }
    return isVaild;
};