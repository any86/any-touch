import { AnyTouchEvent, directionString } from '../interface';
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

    public isWaitingOther: boolean;

    constructor(options: { name?: string, [k: string]: any }) {
        this.options = { ...(<any>this.constructor).DEFAULT_OPTIONS, disabled: false, ...options };
        this.name = this.options.name;
        this.disabled = this.options.disabled;
        this.status = STATUS_POSSIBLE;
        this.isRecognized = false;
        this.requireFailureRecognizers = [];
        this.isWaitingOther = false;
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
            let event = new Event(type, payload);
            Object.assign(event, data);
            this.$root.el.dispatchEvent(event);
        }
    };

    /**
     * 前者需要后者识别失败才能触发
     * @param {Recognizer} 识别器实例 
     */
    public requireFailure(recognizer: this) {
        if (!this.requireFailureRecognizers.includes(recognizer)) {
            this.requireFailureRecognizers.push(recognizer);
        }
    };

    /**
     * 移除识别器之间的"需要失败"关系
     *  @param {Recognizer} 识别器实例 
     */
    public removeRequireFailure(recognizer: Recognizer) {
        for (let [index, requireFailureRecognizer] of this.requireFailureRecognizers.entries()) {
            if (requireFailureRecognizer.name === recognizer.name) {
                this.requireFailureRecognizers.splice(index, 1);
                break;
            }
        }
    };

    /**
     * 是否需要其他手势失败才能触发
     */
    public hasRequireFailure() {
        return 0 < this.requireFailureRecognizers.length;
    };

    /**
     * 是否所有"需要失败"的手势都是disabled的
     */
    public isAllRequireFailureRecognizersDisabled() {
        return this.requireFailureRecognizers.every((recognizer: any) => recognizer.disabled);
    };

    /**
     * 是否要求注册时指定失败的选择器是失败状态
     */
    public isAllRequiresFailedOrPossible(): boolean {
        for (let recognizer of this.requireFailureRecognizers) {
            // console.log(this.name, this.isWaitingOther)
            if (recognizer.isWaitingOther) return false;
            if (STATUS_FAILED !== recognizer.status && STATUS_POSSIBLE !== recognizer.status) {
                return false;
            }
        }
        return true;
    };
    /**
     * 验证触点
     * @param {Number} 触点数
     */
    public isValidPointLength(pointLength: number): boolean {
        return 0 === this.options.pointLength || this.options.pointLength === pointLength;
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

    public flow(isVaild: boolean, activeStatus: string, touchDevice: string): string {
        // if(this.name ==='swipe' ) {
        //     console.log(isVaild, activeStatus, touchDevice);
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
        // console.warn(Number(isVaild),activeStatus, STATE_MAP[Number(isVaild)][activeStatus]);
        if (undefined !== STATE_MAP[Number(isVaild)][activeStatus]) {
            return STATE_MAP[Number(isVaild)][activeStatus][touchDevice] || activeStatus;
        } else {
            return activeStatus;
        }
    };

    /**
     * 如果识别结束, 那么重置状态
     */
    protected _resetStatus() {
        // if (this.name === 'tap') console.log('@', this.status);
        //STATUS_RECOGNIZED === STATUS_END
        if (-1 !== [STATUS_END, STATUS_CANCELLED, STATUS_RECOGNIZED, STATUS_FAILED].indexOf(this.status)) {

            this.status = STATUS_POSSIBLE;
        };
    };

    /**
     * 适用于大部分移动类型的手势, 
     * 如pan/rotate/pinch/swipe
     * @param {AnyTouchEvent} 计算数据 
     */
    recognize(computed: AnyTouchEvent) {
        // if(this.name === 'pan')    console.log(this.name,this.status);
        // 是否识别成功
        let isVaild = this.test(computed);

        // 重置status
        this._resetStatus();

        // 状态变化流程
        let { eventType } = computed;

        this.status = this.flow(isVaild, this.status, eventType);

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
     * @param {AnyTouchEvent} 计算数据
     * @param {(isRecognized: boolean) => void}} 接收是否识别状态
     */
    abstract test(computed: AnyTouchEvent): boolean;

    /**
     * 识别成功后执行
     * 这个阶段可以对computed数据做些处理
     * 比如pan可以针对不支持的方向吧deltaX/Y调整为0
     * swipe可以把不支持的方向上的速率调整为0
     * @param {AnyTouchEvent} 计算数据 
     */
    public afterRecognized(computed: AnyTouchEvent): void { };

    /**
     * 基类的所有emit触发后执行
     * @param {AnyTouchEvent} computed 
     */
    public afterEmit(computed: AnyTouchEvent): void { };

    /**
     * 计算当前手势的touch-action
     */
    abstract getTouchAction(): string[];
};

