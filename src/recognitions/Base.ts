/*
* 未知 => 识别成功 => 已知(开始|结束) => 已知(移动变化中) => 已知(结束)
* 未知 => 识别失败 
* 未知 => 取消(已知的任意阶段)
* */
import AnyEvent from 'any-event';
import { Computed } from '../interface';
import { Options } from '../../types/recognition';

import { INPUT_CANCEL, INPUT_END, INPUT_MOVE, INPUT_START } from '../const';
import {
    STATUS_POSSIBLE,
    STATUS_START,
    STATUS_MOVE,
    STATUS_END,
    STATUS_CANCELLED,
    STATUS_FAILED, STATUS_RECOGNIZED
} from '../const/recognizerStatus';
export default abstract class Recognizer {
    // 关联元素
    public el: HTMLElement | HTMLDocument | Window;
    // 是否构造原生事件(new Event())
    public hasDomEvents: boolean;
    // 手势名
    public name: string;
    // 识别状态
    public status: string;
    // 是否已识别
    public isRecognized: boolean;
    // 选项
    public options: { [propName: string]: any };
    // 需要对应手势失败才能识别成功
    public requireFailureRecognizers: any[];
    // 存储外部注入方法的容器
    public $root: { [k: string]: (...args: any[]) => void };
    // 注入外部方法到识别器原型上
    public static $inject: (key: string, method: (...args: any[]) => void) => void;
    // 默认参数
    public defaultOptions: Options;

    public eventBus: any;

    constructor(options: Options = { disabled: false }) {
        this.options = { ...this.defaultOptions, ...options };
        this.name = this.options.name;
        this.status = STATUS_POSSIBLE;
        this.isRecognized = false;
        this.requireFailureRecognizers = [];
    };

    /**
     * 设置识别器
     * @param {Object} 选项 
     */
    public set(options: { [propName: string]: any }) {
        this.options = { ...this.options, ...options };
        // 刷新anyTouch
        Recognizer.prototype.$root.update();
    };

    /**
     * 对eventBus进行封装
     * @param type 
     * @param payload 
     */
    public emit(type: string, payload: any) {
        payload.type = type;
        this.eventBus.emit(type, payload);
        if (this.hasDomEvents) {
            // 过滤掉几个Event上保留的字段
            let { target, currentTarget, type, ...data } = payload;
            let event: any = new Event(type, payload);
            Object.assign(event, data);
            this.el.dispatchEvent(event);
        }
    };

    /**
     * 对eventBus进行封装
     * @param type 
     * @param payload 
     */
    public on(type: string, listener: ((data: any) => void)) {
        this.eventBus.on(type, listener);
    };

    /**
     * 对eventBus进行封装
     * @param type 
     * @param payload 
     */
    public off(type: string, listener: ((data: any) => void)) {
        this.eventBus.off(type, listener);
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
        return isOnlyHorizontal;
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
        return isOnlyVertical;
    };

    /**
     * 是否支持该方向
     * @param {String} 方向 
     */
    public isVaildDirection(direction: string) {
        return -1 < this.options.directions.indexOf(direction);
    };

    /**
     * 适用于大部分移动类型的手势
     * 如果是STATUS_END, STATUS_CANCELLED, STATUS_FAILED, STATUS_RECOGNIZED状态下, 
     * 那么重置状态到STATUS_POSSIBLE.
     * 在move阶段如果识别了, 那么是被识别为 STATUS_START(用来识别pan/pinch/rotate/swipe等事件).
     * 之后如果继续发生move, 那么是被识别为 STATUS_MOVE.
     * 直到发生end, 这时如果是 STATUS_START || STATUS_MOVE, 那么识别为 STATUS_END, 
     * 如果刚刚被识别那么标记为 STATUS_RECOGNIZED(可以用来识别tap类事件).
     * 如果仍旧未被识别那么标记为 STATUS_FAILED.
     * 如果在 STATUS_FAILED之前 && STATUS_START之后发生了cancel事件, 那么识别为 STATUS_CANCELLED.
     * @param {Computed} 计算数据 
     */
    recognize(computed: Computed) {
        if (this.options.disabled) return;
        // this.beforeRecognize(computed);
        let { inputStatus } = computed;
        // 是否识别成功
        let isVaild = this.test(computed);

        // 如果识别结束, 那么重置状态
        if (-1 < [STATUS_END, STATUS_CANCELLED, STATUS_FAILED, STATUS_RECOGNIZED].indexOf(this.status)) {
            this.status = STATUS_POSSIBLE;
        };

        if (!isVaild && STATUS_POSSIBLE === this.status && INPUT_END === inputStatus) {
            this.status = STATUS_FAILED;
        } else if (STATUS_POSSIBLE === this.status && INPUT_END === inputStatus && isVaild) {
            this.status = STATUS_RECOGNIZED;
        } else if (STATUS_POSSIBLE === this.status && INPUT_MOVE === inputStatus && isVaild) {
            this.status = STATUS_START;
        } else if (STATUS_START === this.status && INPUT_MOVE === inputStatus) {
            this.status = STATUS_MOVE;
        } else if (STATUS_MOVE === this.status && INPUT_END === inputStatus) {
            this.status = STATUS_END;
        } else if ((STATUS_START === this.status || STATUS_MOVE === this.status) && INPUT_CANCEL === inputStatus || !isVaild) {
            this.status = STATUS_CANCELLED;
        }

        console.log(
            `%c ${this.options.name} `, 'background-color:#66c;color:#fff;',
            this.status,
            `${inputStatus} `
        );
        // 是否已识别
        this.isRecognized = -1 < [STATUS_START, STATUS_MOVE].indexOf(this.status);

        if (isVaild) {
            this.emit(this.options.name, computed);
        }
        // if(this.options.name == 'pan2') console.log(this.status);

        // if (this.options.name == 'pinch') {
        //     console.log({ 
        //         status: this.status, 
        //         scale:computed.scale,
        //         isVaild, 
        //         isRecognized: this.isRecognized });
        // }

        if (-1 < ['start', 'move', 'end', 'recognized'].indexOf(this.status)) {
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

    /**
     * 计算当前手势的touch-action
     */
    abstract getTouchAction(): string[];
};

// 外部的方法的载体
Recognizer.prototype.$root = {};
Recognizer.prototype.eventBus = new AnyEvent();
/**
 * 注入AnyTouch上的方法到识别器原型上
 * @param {String} 方法名
 * @param {Function} 对应AnyTouch上方法
 */
Recognizer.$inject = (key, method) => {
    Recognizer.prototype.$root[key] = method;
};


