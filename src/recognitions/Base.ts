/*
* 未知 => 识别成功 => 已知(开始|结束) => 已知(移动变化中) => 已知(结束)
* 未知 => 识别失败 
* 未知 => 取消(已知的任意阶段)
* */
import { nativeEventType } from '../interface';
export default class Recognizer {
    public name:string;
    public status: string;
    public isRecognized: boolean;
    public options: any;
    public requireFailureRecognizers: any[];
    constructor(options:any) {
        this.name = options.name;
        this.status = 'unknown';
        this.isRecognized = false;
        this.requireFailureRecognizers = [];
    };

    /**
     * 前者需要后者识别失败才能触发
     * @param {Recognizer} 识别器实例 
     */
    public requireFailure(recognizer: any) {
        if (!this.requireFailureRecognizers.includes(recognizer)) {
            this.requireFailureRecognizers.push(recognizer);
        }
    };

    public hasRequireFailure() {
        return 0 < this.requireFailureRecognizers.length;
    };

    /**
     * 是否要求注册时指定失败的选择器是失败状态
     */
    public isOtherFailOrWait(): boolean {
        const { length } = this.requireFailureRecognizers;
        for (let index = 0; index < length; index++) {
            const recognizer = this.requireFailureRecognizers[index];
            // console.log(recognizer.status);
            if ('fail' !== recognizer.status && 'unknown' !== recognizer.status) {
                return false;
            }
        };
        return true;
    };

    /**
     * 识别手势事件的状态
     * 手势的状态, 非原生事件的状态
     * @param {nativeEventType} 输入状态 
     */
    public recognizeType(nativeEventType: nativeEventType) {
        if (this.isRecognized) {
            if ('move' === nativeEventType) {
                return 'move';
            } else {
                this.isRecognized = false;
                return 'end';
            }
        } else {
            this.isRecognized = true;
            return 'start';
        }
    };
};