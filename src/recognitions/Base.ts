/*
* 未知 => 识别成功 => 已知(开始|结束) => 已知(移动变化中) => 已知(结束)
* 未知 => 识别失败 
* 未知 => 取消(已知的任意阶段)
* */
import { inputStatus, Computed } from '../interface';
// import { RECOGNIZER_STATUS_POSSIBLE, RECOGNIZER_STATUS_BEGAN, RECOGNIZER_STATUS_CHANGED, RECOGNIZER_STATUS_ENDED, RECOGNIZER_STATUS_RECOGNIZED, RECOGNIZER_STATUS_CANCELLED, RECOGNIZER_STATUS_FAILED } from '../const'
export default abstract class Recognizer {
    public name: string;
    public status: string;
    public isRecognized: boolean;
    public options: { [propName: string]: any };
    public requireFailureRecognizers: any[];
    private _injectedEmit: any;
    constructor(options: any) {
        this.name = options.name;
        this.status = 'possible';
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
    public isTheOtherFail(): boolean {
        const { length } = this.requireFailureRecognizers;
        for (let index = 0; index < length; index++) {
            const recognizer = this.requireFailureRecognizers[index];
            // console.log(recognizer.status);
            if ('fail' !== recognizer.status && 'possible' !== recognizer.status) {
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
    public changeStatus(inputStatus: inputStatus) {
        if (this.isRecognized) {
            if('end'=== this.status) {
                this.status = 'possible';
            } else if ('move' === inputStatus) {
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
    };

    /**
     * 识别器也是整个识别器控制流程走向的方法
     * @param {Computed} 计算数据 
     * @param {RecognizerCallback} 识别后触发钩子 
     */
    public recognize(computed: Computed) {
        this.test(computed, isRecognized => {
            if (isRecognized) {
                this.changeStatus(computed.inputStatus);
                this.afterRecognized(computed);
                this.emit(this.name, computed);
            } else {
                this.status = 'fail';
            }
        })
    };

    /**
     * 识别条件, 基于异步
     * @param {Computed} 计算数据
     * @param {(isRecognized: boolean) => void}} 接收是否识别状态
     */
    abstract test(computed: Computed, callback: (isRecognized: boolean) => void): void;

    /**
     * 识别成功后执行
     * @param {Computed} 计算数据 
     */
    abstract afterRecognized(computed: Computed): void;
};