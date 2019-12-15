import { Recognizer } from '@types';
import RecognizerBase from './Base';
import {
    STATUS_POSSIBLE,
    STATUS_FAILED
} from '@/const/recognizerStatus';
import { ERROR_MESSAGE_IS_NOT_RECOGNIZE } from '@/const/ERROR_MESSAGE';
import Base from './Base';
export default abstract class extends Base {
    // 正在等待其他识别器失败
    isWaitingOtherFail: boolean;

    waitOtherFailTime: number;

    // 需要"失败"识别器列表
    requireFailRecognizers: Recognizer[];

    constructor(options: { name?: string, [k: string]: any }) {
        super(options)
        this.waitOtherFailTime = 0;
        this.isWaitingOtherFail = false;
        this.requireFailRecognizers = [];
    };
    /**
     * 是否识别器实例
     * @param {Any} 待验证 
     * @returns {Boolean} 是否识别器实例
     */
    isRecognizer(recognizer: string | Recognizer): recognizer is RecognizerBase {
        return recognizer instanceof RecognizerBase;
    };
    /**
     * 获取手势
     * @param {String|Recognizer} 识别器实例或名字
     */
    getRecognizer(one: string | Recognizer): Recognizer | void {
        return this.isRecognizer(one) ? one : this.recognizerMap[one];
    };

    /**
     * 注册失败(互斥)关系
     * 前者需要后者识别失败才能触发
     * @param {Recognizer} 识别器实例 
     * @param {Number} 延迟时间
     */
    requireFailure(some: string | Recognizer | string[] | Recognizer[], waitTime: number = 0): void {
        this.waitOtherFailTime = waitTime;
        this.requireFailRecognizers = [];
        if (Array.isArray(some)) {
            for (const one of some) {
                const recognizer = this.getRecognizer(one);
                if (void 0 !== recognizer) {
                    this.requireFailRecognizers.push(recognizer);
                }
            }
        } else {
            // 指定手势
            const recognizer = this.getRecognizer(some);
            if (void 0 !== recognizer) {
                this.requireFailRecognizers.push(recognizer);
            }
        }
    };

    /**
     * 移除识别器之间的"需要失败"关系
     *  @param {Recognizer} 识别器实例 
     */
    removeRequireFailure(recognizerName: string) {
        this.requireFailRecognizers = this.requireFailRecognizers.filter(({ name }) => recognizerName !== recognizerName)
    };

    /**
     * 是否需要其他手势失败才能触发
     * 且有手势是"开启"状态
     */
    hasRequireFailure(): boolean {
        return 0 < this.requireFailRecognizers.length;
    };

    /**
     * 检查指定手势是否失败(可指定时间点)
     * @param {Function} 返回"是否失败状态"
     */
    waitOtherFailed(resultCallback: (isFailed: boolean) => void, waitTime?: number): void {
        this.isWaitingOtherFail = true;
        const hasEnabled = this.requireFailRecognizers.some(recognizer => !recognizer.disabled);
        if (hasEnabled) {
            setTimeout(() => {
                const isAllFailed = this.requireFailRecognizers.every(recognizer => {
                    return [STATUS_FAILED, STATUS_POSSIBLE].includes(recognizer.status) &&
                        'isWaitingOtherFail' in recognizer && !recognizer.isWaitingOtherFail
                });
                // 根据自定义延迟时间的不同, 会触发多次
                this.isWaitingOtherFail = false;
                resultCallback(isAllFailed);
            }, Number(waitTime || this.waitOtherFailTime));
        } else {
            this.isWaitingOtherFail = false;
            resultCallback(true);
        }
    }
};

