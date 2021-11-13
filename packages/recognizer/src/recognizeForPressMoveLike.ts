import { STATUS_FAILED, RECOGNIZER_STATUS } from '@any-touch/shared';

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