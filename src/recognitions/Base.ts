/*
* 未知 => 识别成功 => 已知(开始|结束) => 已知(移动变化中) => 已知(结束)
* 未知 => 识别失败 
* 未知 => 取消(已知的任意阶段)
* */
import { Computed } from '../interface';
import {
    STATUS_POSSIBLE,
    STATUS_START,
    STATUS_MOVE,
    STATUS_END,
    STATUS_CANCELLED,
    STATUS_FAILED
} from '../const/recognizerStatus';
export default abstract class Recognizer {
    public name: string;
    public status: string;
    public isRecognized: boolean;
    public options: { [propName: string]: any };
    public requireFailureRecognizers: any[];
    private _injectedEmit: any;
    constructor(options: any) {
        this.options = Object.assign({}, options);
        this.status = STATUS_POSSIBLE;
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
            if (STATUS_FAILED !== recognizer.status && STATUS_POSSIBLE !== recognizer.status) {
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
     * 识别器也是整个识别器控制流程走向的方法
     * @param {Computed} 计算数据 
     * @param {RecognizerCallback} 识别后触发钩子 
     */
    public flowStatus(computed: Computed, isRecognized: boolean) {
        if (isRecognized) {
            // 已识别
            if (STATUS_START !== this.status && STATUS_MOVE !== this.status) {
                this.status = STATUS_START;
            } else {
                this.status = STATUS_MOVE;
            }
            // this.afterRecognized(computed);
            this.emit(this.options.name, computed);
        } else {
            if ('end' === computed.inputStatus) {
                if (!this.isRecognized) {
                    this.status = STATUS_FAILED;
                } else {
                    this.status = STATUS_END;
                    // this.afterRecognized(computed);
                }
            } else {
                this.status = STATUS_POSSIBLE;
            }
        }
        this.isRecognized = isRecognized;

        // if (this.options.name === 'doubletap') {
        //     console.log(this.status, this.isRecognized, computed.inputStatus);
        // }
    };

    recognize(computed: Computed) {
        // this.beforeRecognize(computed);
        let { inputStatus } = computed;
        // 是否识别成功
        let isVaild = this.test(computed);
        // 是否已识别
        let isRecognized = -1 < [STATUS_START, STATUS_MOVE].indexOf(this.status);
        if (STATUS_POSSIBLE === this.status && isVaild) {
            this.status = STATUS_START;
        } else if (isRecognized && 'move' === inputStatus) {
            this.status = STATUS_MOVE;
        } else if (isRecognized && 'end' === inputStatus) {
            this.status = STATUS_END;
        } else if (!isRecognized && !isVaild) {
            this.status = STATUS_POSSIBLE;
        } else if ('cancel' === inputStatus) {
            this.status = STATUS_CANCELLED;
        } else if (!isRecognized && !isVaild && 'end' === inputStatus) {
            this.status = STATUS_FAILED;
        } else {
            this.status = 'uncatched'
        }
        if(isVaild) {
            this.emit(this.options.name, computed);
        }

        if(-1 < ['start', 'move', 'end'].indexOf(this.status)) {
            // panleft | panright | pandown | panup
            // this.emit(this.options.name + computed.direction, computed);
            // panstart | panmove | panend
            this.emit(this.options.name + this.status, computed);
            this.afterRecognized(computed);
        }
    };

    /**
     * 识别条件, 基于异步
     * @param {Computed} 计算数据
     * @param {(isRecognized: boolean) => void}} 接收是否识别状态
     */
    abstract test(computed: Computed): boolean;

    /**
     * 识别成功后执行
     * @param {Computed} 计算数据 
     */
    abstract afterRecognized(computed: Computed): void;
    // abstract beforeRecognize(computed: Computed): void;
};