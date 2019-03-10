/*
* 未知 => 识别成功 => 已知(开始|结束) => 已知(移动变化中) => 已知(结束)
* 未知 => 识别失败 
* 未知 => 取消(已知的任意阶段)
* */
import { Computed, directionString } from '../interface';
import { INPUT_CANCEL, INPUT_END, INPUT_MOVE } from '../const';
import {
    STATUS_POSSIBLE,
    STATUS_START,
    STATUS_MOVE,
    STATUS_END,
    STATUS_CANCELLED,
    STATUS_FAILED, STATUS_RECOGNIZED
} from '../const/recognizerStatus';

export default abstract class Recognizer {
    // 手势名
    public name: string;
    // 是否禁止
    public disabled: boolean;
    // 识别状态
    public status: string;
    // 是否已识别
    public isRecognized: boolean;
    // 选项
    public options: { [propName: string]: any };
    // 需要对应手势失败才能识别成功
    public requireFailureRecognizers: any[];
    // 存储外部注入方法的容器
    public $root: any;

    public eventEmitter: any;

    constructor(options: { name?: string, [k: string]: any }) {
        this.options = { ...(<any>this.constructor).DEFAULT_OPTIONS, disabled: false, ...options };
        this.name = this.options.name;
        this.disabled = this.options.disabled;
        this.status = STATUS_POSSIBLE;
        this.isRecognized = false;
        this.requireFailureRecognizers = [];
        // 这里面不能直接调用$root等, 
        // 因为rollup生成的代码构造函数并不是该constructor
        // 而是构造函数中又嵌套了一个同名构造函数
    };

    /**
     * 设置识别器
     * @param {Object} 选项 
     */
    public set(options = {}) {
        this.options = { ...this.options, ...options };
        // 刷新anyTouch
        this.$root.update();
        return this;
    };

    public $injectRoot($root: any) {
        this.$root = $root;
        return this;
    }

    /**
     * 对eventEmitter进行封装
     * @param type 
     * @param payload 
     */
    public emit(type: string, payload: any) {
        payload.type = type;
        this.$root.eventEmitter.emit(type, payload);
        if (this.$root.options.hasDomEvents) {
            // 过滤掉几个Event上保留的字段
            let { target, currentTarget, type, ...data } = payload;
            let event: any = new Event(type, payload);
            Object.assign(event, data);
            this.$root.el.dispatchEvent(event);
        }
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
    public isVaildDirection(direction?: directionString) {
        return -1 !== this.options.directions.indexOf(direction) || 'none' === direction;
    };

    flow(isVaild: boolean, activeState: string, inputType: string): string | undefined {
        // if(this.name ==='swipe' ) {
        //     console.log(isVaild, activeState, inputType);
        // }
        const STATE_MAP: { [k: number]: any } = {
            // isVaild === true,
            // Number(true) === 1
            // 这个分支不会出现STATUS_FAILED
            // STATUS_END在上面的代码中也会被重置为STATUS_POSSIBLE, 从而进行重新识别
            1: {
                [STATUS_POSSIBLE]: {
                    [INPUT_MOVE]: STATUS_START,
                    [INPUT_END]: STATUS_RECOGNIZED,
                    [INPUT_CANCEL]: STATUS_CANCELLED
                },
                [STATUS_START]: {
                    [INPUT_MOVE]: STATUS_MOVE,
                    [INPUT_END]: STATUS_END,
                    [INPUT_CANCEL]: STATUS_CANCELLED
                },
                [STATUS_MOVE]: {
                    [INPUT_MOVE]: STATUS_MOVE,
                    [INPUT_END]: STATUS_END,
                }
            },
            // isVaild === false
            // 这个分支有STATUS_FAILED
            0: {
                [STATUS_START]: {
                    [INPUT_MOVE]: STATUS_CANCELLED,
                    [INPUT_END]: STATUS_END,
                    [INPUT_CANCEL]: STATUS_CANCELLED
                },
                [STATUS_MOVE]: {
                    [INPUT_MOVE]: STATUS_CANCELLED,
                    [INPUT_END]: STATUS_END,
                    [INPUT_CANCEL]: STATUS_CANCELLED
                }
            }
        };
        // console.warn(Number(isVaild),activeState, STATE_MAP[Number(isVaild)][activeState]);
        if (undefined !== STATE_MAP[Number(isVaild)][activeState]) {
            return STATE_MAP[Number(isVaild)][activeState][inputType] || activeState;
        }

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
        // if(this.name === 'pan')    console.log(this.name,this.status);
        // 是否识别成功
        let isVaild = this.test(computed);

        // 如果识别结束, 那么重置状态
        if (-1 !== [STATUS_END, STATUS_CANCELLED, STATUS_FAILED, STATUS_RECOGNIZED].indexOf(this.status)) {
            this.status = STATUS_POSSIBLE;
        };

        // 状态变化流程
        let { eventType } = computed;

        this.status = this.flow(isVaild, this.status, eventType) || this.status;

        if (STATUS_CANCELLED === this.status) {
            this.emit(this.options.name + 'cancel', computed);
            return;
        }

        // 是否已识别
        this.isRecognized = -1 < [STATUS_START, STATUS_MOVE, STATUS_END, STATUS_RECOGNIZED].indexOf(this.status);
        // 识别后触发的事件
        if (this.isRecognized) {
            this.afterRecognized(computed);
            // computed = this.lockDirection(computed);d
            this.emit(this.options.name, computed);
            // console.log(this.options.name, computed);
            if (-1 < [STATUS_START, STATUS_MOVE, STATUS_END, STATUS_RECOGNIZED].indexOf(this.status)) {
                // panstart | panmove | panend等
                this.emit(this.options.name + this.status, computed);
                this.afterEmit(computed);
            }
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
     * 这个阶段可以对computed数据做些处理
     * 比如pan可以针对不支持的方向吧deltaX/Y调整为0
     * swipe可以把不支持的方向上的速率调整为0
     * @param {Computed} 计算数据 
     */
    public afterRecognized(computed: Computed): void { };

    /**
     * 基类的所有emit触发后执行
     * @param {Computed} computed 
     */
    public afterEmit(computed: Computed): void { };

    /**
     * 计算当前手势的touch-action
     */
    abstract getTouchAction(): string[];
};

