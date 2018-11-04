/*
* 未知 => 识别成功 => 已知(开始|结束) => 已知(移动变化中) => 已知(结束)
* 未知 => 识别失败 
* 未知 => 取消(已知的任意阶段)
* */
import { inputStatus, RecognizerStatus } from '../interface';
// import { RECOGNIZER_STATUS_POSSIBLE, RECOGNIZER_STATUS_BEGAN, RECOGNIZER_STATUS_CHANGED, RECOGNIZER_STATUS_ENDED, RECOGNIZER_STATUS_RECOGNIZED, RECOGNIZER_STATUS_CANCELLED, RECOGNIZER_STATUS_FAILED } from '../const'
export default class Recognizer {
    public name: string;
    public status: string;
    public isRecognized: boolean;
    public options: { [propName: string]: any };
    public requireFailureRecognizers: any[];
    private _injectedEmit: any;
    constructor(options: any) {
        this.name = options.name;
        this.status = 'unknown';
        this.isRecognized = false;
        this.requireFailureRecognizers = [];
    };

    /**
     * 注入通用emit方法, 方便改写
     */
    public injectEmit(emit: any) {
        this._injectedEmit = emit;
    };

    public emit(type: string, payload: { [propName: string]: any }) {
        payload.type = type;
        this._injectedEmit(type, payload);
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
     * 验证触点
     * @param {Number} 触点数
     */
    public pointerLengthTest(pointerLength: number): boolean {
        return 0 === this.options.pointerLength || this.options.pointerLength === pointerLength
    };
    /**
     * 识别手势事件的状态
     * 手势的状态, 非原生事件的状态
     * @param {inputStatus} 输入状态 
     */
    public getRecognizerState(inputStatus: inputStatus) {
        if (this.isRecognized) {
            if ('move' === inputStatus) {
                this.status = 'move';
            } else if ('cancel' === inputStatus) {
                this.status = 'cancel';
            } else {
                this.isRecognized = false;
                this.status = 'end';
            }
        } else {
            this.isRecognized = true;
            this.status = 'start';
        }
        return this.status;
    };
};