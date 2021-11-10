import { EventTrigger, Input, Computed,STATUS_FAILED, RECOGNIZER_STATUS } from '@any-touch/shared';
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

/**
 * 计算当前识别器状态
 * 是否test通过 + 上一轮识别器状态 + 输入阶段 => 当前识别器状态 
 * @param isVaild 是否通过test
 * @param lastStatus 上一轮识别器状态
 * @param phase 输入阶段
 * @returns 识别器状态
 */
export function flow(isVaild: boolean, lastStatus: RECOGNIZER_STATUS, phase: string): RECOGNIZER_STATUS {
    /*
    * {
    *  isValid {
    *    lastStatus {
    *      phase: currentStatus
    *    }
    *  }
    * }
    * Number(true) === 1
    * 这个分支不会出现STATUS_FAILED
    * STATUS_END在上面的代码中也会被重置为STATUS_POSSIBLE, 从而进行重新识别
    */
    const STATE_MAP: { [k: number]: any } = {
        1: {
            [STATUS_POSSIBLE]: {
                // 下面都没有INPUT_START
                // 是因为pressmove类的判断都是从INPUT_MOVE阶段开始
                [INPUT_MOVE]: STATUS_START,
                // 暂时下面2种可有可无, 
                // 因为做requireFail判断的时候possible和failure没区别
                [INPUT_END]: STATUS_FAILED,
                [INPUT_CANCEL]: STATUS_FAILED
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
        0: {
            // 此处没有STATUS_POSSIBLE和STATUS_END
            // 是因为返回值仍然是STATUS_POSSIBLE
            [STATUS_START]: {
                // 此处的INPUT_MOVE和INPUT_END
                // 主要是针对多触点识别器
                [INPUT_MOVE]: STATUS_FAILED,
                [INPUT_END]: STATUS_END,
                [INPUT_CANCEL]: STATUS_CANCELLED
            },

            [STATUS_MOVE]: {
                [INPUT_START]: STATUS_FAILED,
                [INPUT_MOVE]: STATUS_FAILED,
                [INPUT_END]: STATUS_END,
                [INPUT_CANCEL]: STATUS_CANCELLED
            }
        }
    };

    const phaseToStatusMap = STATE_MAP[Number(isVaild)][lastStatus];
    return void 0 !== phaseToStatusMap && phaseToStatusMap[phase] || lastStatus;
};

/**
 * 适用于大部分移动类型的手势, 
 * 如pan/rotate/pinch/swipe
 * @param recognizer 识别器实例
 * @param computed 当前输入
 * @param emit at实例上的emit函数
 * @returns 是否通过test
 */
export default function (recognizer: Recognizer, computed: Computed, emit: EventTrigger): boolean {
    // 是否识别成功
    const isVaild = recognizer._$test(computed);
    // console.log({isVaild},input.phase,recognizer.name)
    resetStatus(recognizer);

    // 状态变化流程
    const { phase } = computed;

    recognizer.status = flow(isVaild, recognizer.status, phase);
    // 是否已识别, 包含end
    recognizer._$isRecognized = ([STATUS_START, STATUS_MOVE] as RECOGNIZER_STATUS[]).includes(recognizer.status);

    const { name, status: status, _$isRecognized: isRecognized } = recognizer;
    // if('pan' == name) console.warn(status,phase,{isRecognized,isVaild},input.pointLength)
    // 识别后触发的事件
    if (isRecognized) {
        emit(name);
    }
    // if('pan' == recognizer.name){
    //     console.log(isRecognized,recognizer.name)
    // }
    if (isRecognized || ([STATUS_END, STATUS_CANCELLED] as RECOGNIZER_STATUS[]).includes(recognizer.status)) {
        // console.log(name + status,computed.deltaX )
        emit(name + status);
    }
    return isVaild;
};