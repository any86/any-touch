import { EventTrigger, Computed, RECOGNIZER_STATUS } from '@any-touch/shared';
import {STAGE} from '@any-touch/shared';


const ACTION_MAP: Record<number, string> = {
    [RECOGNIZER_STATUS.START]: STAGE.START,
    [RECOGNIZER_STATUS.MOVE]: STAGE.MOVE,
    [RECOGNIZER_STATUS.END]: STAGE.END,
    [RECOGNIZER_STATUS.CANCELLED]: STAGE.CANCEL
};

/**
 * 计算当前识别器状态
 * 是否test通过 + 上一轮识别器状态 + 输入阶段 => 当前识别器状态 
 * @param isVaild 是否通过test
 * @param lastStatus 上一轮识别器状态
 * @param stage 输入阶段
 * @returns 识别器状态
 */
function flow(
    isVaild: boolean,
    lastStatus: RECOGNIZER_STATUS,
    stage: string): RECOGNIZER_STATUS {
    /*
    * {
    *  isValid {
    *    lastStatus {
    *      stage: currentStatus
    *    }
    *  }
    * }
    * Number(true) === 1
    * 这个分支不会出现RECOGNIZER_STATUS.FAILED
    * RECOGNIZER_STATUS.END在上面的代码中也会被重置为RECOGNIZER_STATUS.POSSIBLE, 从而进行重新识别
    */
    const STATE_MAP: { [k: number]: any } = {
        1: {
            [RECOGNIZER_STATUS.POSSIBLE]: {
                // 下面都没有INPUT_START
                // 是因为pressmove类的判断都是从INPUT_MOVE阶段开始
                [STAGE.MOVE]: RECOGNIZER_STATUS.START,
                // 暂时下面2种可有可无, 
                // 因为做requireFail判断的时候possible和failure没区别
                [STAGE.END]: RECOGNIZER_STATUS.FAILED,
                [STAGE.CANCEL]: RECOGNIZER_STATUS.FAILED
            },

            [RECOGNIZER_STATUS.START]: {
                [STAGE.MOVE]: RECOGNIZER_STATUS.MOVE,
                [STAGE.END]: RECOGNIZER_STATUS.END,
                [STAGE.CANCEL]: RECOGNIZER_STATUS.CANCELLED
            },

            [RECOGNIZER_STATUS.MOVE]: {
                [STAGE.MOVE]: RECOGNIZER_STATUS.MOVE,
                [STAGE.END]: RECOGNIZER_STATUS.END,
                [STAGE.CANCEL]: RECOGNIZER_STATUS.CANCELLED
            }
        },
        // isVaild === false
        // 这个分支有RECOGNIZER_STATUS.FAILED
        0: {
            // 此处没有RECOGNIZER_STATUS.POSSIBLE和RECOGNIZER_STATUS.END
            // 是因为返回值仍然是RECOGNIZER_STATUS.POSSIBLE
            [RECOGNIZER_STATUS.START]: {
                // 此处的INPUT_MOVE和INPUT_END
                // 主要是针对多触点识别器
                [STAGE.MOVE]: RECOGNIZER_STATUS.FAILED,
                [STAGE.END]: RECOGNIZER_STATUS.FAILED,
                [STAGE.CANCEL]: RECOGNIZER_STATUS.CANCELLED
            },

            [RECOGNIZER_STATUS.MOVE]: {
                [STAGE.START]: RECOGNIZER_STATUS.FAILED,
                [STAGE.MOVE]: RECOGNIZER_STATUS.FAILED,
                [STAGE.END]: RECOGNIZER_STATUS.END,
                [STAGE.CANCEL]: RECOGNIZER_STATUS.CANCELLED
            }
        }
    };

    const stageToStatusMap = STATE_MAP[Number(isVaild)][lastStatus];
    return void 0 !== stageToStatusMap && stageToStatusMap[stage] || lastStatus;
};

/**
 * 适用于移动类型手势的识别函数
 * @param computed 计算数据
 * @param test 测试函数
 * @param name 手势名称
 * @param status 当前识别器状态
 * @param emit 事件触发器
 * @param after 识别后触发,无论成功/失败
 * @returns 是否识别
 */
export default function (
    computed: Computed,
    test: (c: Computed) => boolean,
    name: string,
    status: RECOGNIZER_STATUS,
    emit: EventTrigger,
    after: ([isRecognized, status]: [boolean, RECOGNIZER_STATUS]) => void
): boolean {
    // 是否识别成功
    const isVaild = test(computed);

    // 当前状态
    const newStatus = flow(isVaild, status, computed.stage);
    // 是否已识别, 包含end
    const isRecognizedNow = ([RECOGNIZER_STATUS.START, RECOGNIZER_STATUS.MOVE]).includes(newStatus);

    // 返回数据给识别器
    after([isRecognizedNow, newStatus]);

    // 识别后触发的事件
    if (isRecognizedNow) {
        emit(name);
    }

    if (isRecognizedNow || ([RECOGNIZER_STATUS.END, RECOGNIZER_STATUS.CANCELLED]).includes(newStatus)) {
        emit(name + ACTION_MAP[newStatus]);
    }
    return isVaild;
};