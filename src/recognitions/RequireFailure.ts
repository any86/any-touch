import Recognizer from './Base';
import {
    STATUS_POSSIBLE,
    STATUS_FAILED
} from '@/const/recognizerStatus';
import { ERROR_MESSAGE_IS_NOT_RECOGNIZE } from '@/const/ERROR_MESSAGE';

export default class{
    recognizerMap: Record<string, Recognizer>;
    
    // 需要监听的手势map
    requireFailureRecognizerMap?: Record<string, {
        recognizer: Recognizer,
        waitTime: number
    }>;

    constructor() {
        this.recognizerMap = {};
        this.requireFailureRecognizerMap = {}
    };

    /**
     * 是否识别器实例
     * @param {Any} 待验证 
     * @returns {Boolean} 是否识别器实例
     */
    isRecognizer(recognizer: string | Recognizer): recognizer is Recognizer {
        return recognizer instanceof Recognizer;
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
    requireFailure(one: string | Recognizer, waitTime: number = 0): void {
        // 指定手势
        const recognizer = this.getRecognizer(one);

        if (void 0 === recognizer) {
            throw ERROR_MESSAGE_IS_NOT_RECOGNIZE;
        } else {
            const { name } = recognizer;
            // 如果未添加, 那么更新map
            // 否则跳过
            if (void 0 !== this.requireFailureRecognizerMap && void 0 === this.requireFailureRecognizerMap[name]) {
                // 存储到"需要失败"map
                this.requireFailureRecognizerMap[name] = {
                    recognizer: this.recognizerMap[name],
                    waitTime
                };
            }
        }
    };

    /**
     * 移除识别器之间的"需要失败"关系
     *  @param {Recognizer} 识别器实例 
     */
    removeRequireFailure(recognizerName: string) {
        if (void 0 !== this.requireFailureRecognizerMap) {
            delete this.requireFailureRecognizerMap[recognizerName];
        }
    };

    /**
     * 是否需要其他手势失败才能触发
     * 且有手势是"开启"状态
     */
    hasRequireFailure(): boolean {
        for (const key in this.requireFailureRecognizerMap) {
            const { recognizer } = this.requireFailureRecognizerMap[key];
            if (!recognizer.disabled) {
                return true;
            }
        }
        return false;
    };

    /**
     * 检查指定手势是否失败(可指定时间点)
     * @param {String|Recognizer}  识别器实例|名字
     * @param {Number} 延迟时间, 默认0秒
     * @param {Function} 返回"是否失败状态"
     */
    checkForFailure(one: Recognizer | string, waitTime: number = 0, resultCallback: (isFailed: boolean) => void) {
        const recognizer = this.getRecognizer(one);
        if (void 0 !== recognizer) {
            setTimeout(() => {
                const { status } = recognizer;
                resultCallback([STATUS_FAILED, STATUS_POSSIBLE].includes(status));
            }, waitTime);
        }
    }
};

