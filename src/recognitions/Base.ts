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
    STATUS_FAILED, STATUS_RECOGNIZED
} from '../const/recognizerStatus';
export default abstract class Recognizer {
    public name: string;
    public status: string;
    public isRecognized: boolean;
    public options: { [propName: string]: any };
    public requireFailureRecognizers: any[];
    // 默认参数
    public defaultOptions: { [propName: string]: any };
    private _injectedEmit: any;
    constructor(options: any) {
        this.options = { ...this.defaultOptions, ...options };
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
    public isValidPointerLength(pointerLength: number): boolean {
        return 0 === this.options.pointerLength || this.options.pointerLength === pointerLength
    };

    /**
     * 是否只支持水平方向
     */
    public isOnlyHorizontal() {
        let isOnlyHorizontal = true;
        for (let direction of this.options.directions) {
            isOnlyHorizontal = -1 < ['left', 'right'].indexOf(direction);
            if (!isOnlyHorizontal) {
                return false;
            }
        }
    };

    /**
     * 是否只支持垂直方向
     */
    public isOnlyVertical() {
        let isOnlyVertical = true;
        for (let direction of this.options.directions) {
            isOnlyVertical = -1 < ['up', 'down'].indexOf(direction);
            if (!isOnlyVertical) {
                return false;
            }
        }
    };

    /**
     * 是否支持该方向
     * @param {String} 方向 
     */
    public isVaildDirection(direction:string){
        return -1 < this.options.directions.indexOf(direction);
    };

    /**
     * 适用于大部分移动类型的手势
     * @param {Computed} 计算数据 
     */
    recognize(computed: Computed) {
        // this.beforeRecognize(computed);
        let { inputStatus } = computed;
        // 是否识别成功
        let isVaild = this.test(computed);
        // 如果识别结束, 那么重置状态
        if (-1 < [STATUS_END, STATUS_CANCELLED, STATUS_FAILED, STATUS_RECOGNIZED].indexOf(this.status)) {
            this.status = STATUS_POSSIBLE;
        };

        if (!this.isRecognized && !isVaild && STATUS_POSSIBLE === this.status && 'end' === inputStatus) {
            this.status = STATUS_FAILED;
        } else if (STATUS_POSSIBLE === this.status && 'end' === inputStatus && isVaild) {
            this.status = STATUS_RECOGNIZED;
        } else if (STATUS_POSSIBLE === this.status && isVaild) {
            this.status = STATUS_START;
        } else if (this.isRecognized && 'move' === inputStatus) {
            this.status = STATUS_MOVE;
        } else if (this.isRecognized && 'end' === inputStatus) {
            this.status = STATUS_END;
        } else if (this.isRecognized && 'cancel' === inputStatus) {
            this.status = STATUS_CANCELLED;
        }

        // 是否已识别
        this.isRecognized = -1 < [STATUS_START, STATUS_MOVE].indexOf(this.status);

        if (isVaild) {
            this.emit(this.options.name, computed);
        }

        // if (this.options.name == 'pinch') {
        //     console.log({ 
        //         status: this.status, 
        //         scale:computed.scale,
        //         isVaild, 
        //         isRecognized: this.isRecognized });
        // }

        if (-1 < ['start', 'move', 'end', 'recognized'].indexOf(this.status)) {
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