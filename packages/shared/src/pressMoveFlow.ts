import { RECOGNIZER_STATUS } from './index';
import {
    STATUS_POSSIBLE,
    STATUS_START,
    STATUS_MOVE,
    STATUS_END,
    STATUS_CANCELLED,
    STATUS_FAILED,

    TYPE_START,
    TYPE_CANCEL,
    TYPE_END,
    TYPE_MOVE,
} from './const';

const STATUS_CODE_AND_NAME_MAP: { [k: number]: 'start' | 'move' | 'end' | 'cancel' | undefined } = {
    [STATUS_START]: TYPE_START,
    [STATUS_MOVE]: TYPE_MOVE,
    [STATUS_END]: TYPE_END,
    [STATUS_CANCELLED]: TYPE_CANCEL,
}

/**
 * 获取状态字符串
 * @param code 状态代码
 * @returns 
 */
export function getStatusName(code: RECOGNIZER_STATUS) {
    return STATUS_CODE_AND_NAME_MAP[code];
}

/**
 * 😊如果当前识别成功,
 * 那么计算当前识别器状态.
 * 逻辑: 是否test通过 + 上一轮识别器状态 + 输入阶段 => 当前识别器状态
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
                // 下面都没有TYPE_START
                // 是因为pressmove类的判断都是从TYPE_MOVE阶段开始
                [TYPE_MOVE]: STATUS_START,
                // 暂时下面2种可有可无,
                // 因为做requireFail判断的时候possible和failure没区别
                // [TYPE_END]: STATUS_POSSIBLE,
                // [TYPE_CANCEL]: STATUS_POSSIBLE,
            },

            [STATUS_START]: {
                [TYPE_MOVE]: STATUS_MOVE,
                [TYPE_END]: STATUS_END,
                [TYPE_CANCEL]: STATUS_CANCELLED,
            },

            [STATUS_MOVE]: {
                [TYPE_MOVE]: STATUS_MOVE,
                [TYPE_END]: STATUS_END,
                [TYPE_CANCEL]: STATUS_CANCELLED,
            },
        },
        // isVaild === false
        // 这个分支有STATUS_FAILED
        0: {
            // 此处没有STATUS_POSSIBLE和STATUS_END
            // 是因为返回值仍然是STATUS_POSSIBLE
            [STATUS_START]: {
                // 此处的TYPE_MOVE和TYPE_END
                // 主要是针对多触点识别器
                [TYPE_MOVE]: STATUS_FAILED,
                [TYPE_END]: STATUS_END,
                [TYPE_CANCEL]: STATUS_CANCELLED,
            },

            [STATUS_MOVE]: {
                [TYPE_START]: STATUS_FAILED,
                [TYPE_MOVE]: STATUS_FAILED,
                [TYPE_END]: STATUS_END,
                [TYPE_CANCEL]: STATUS_CANCELLED,
            },
        },
    };
    const map = STATE_MAP[Number(isVaild)][lastStatus];
    return (void 0 !== map && map[phase]) || STATUS_POSSIBLE;
}