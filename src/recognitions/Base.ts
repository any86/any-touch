import { Recognizer, AEvent, directionString, Store, InputRecord } from '@/types';
import { INPUT_CANCEL, INPUT_END, INPUT_MOVE, DIRECTION_X, DIRECTION_Y, NONE } from '@/const';
import {
    STATUS_POSSIBLE,
    STATUS_START,
    STATUS_MOVE,
    STATUS_END,
    STATUS_CANCELLED,
    STATUS_FAILED, STATUS_RECOGNIZED
} from '@/const/recognizerStatus';

export default abstract class RecognizerBase  {
    // 手势名
    name: string;
    // 是否禁止
    disabled: boolean;
    // 识别状态
    status: string;
    // 是否已识别
    isRecognized: boolean;
    // 选项
    options: { [propName: string]: any };
    // 存储外部注入方法的容器
    $root: any;

    eventEmitter: any;


    $store?: Store;

    recognizerMap: Record<string, Recognizer>;

    event: Record<string, any>;

    // 缓存当前手势的计算结果
    // 每次手势识别前, 
    // 会把前面所有手势的计算结果作为当前计算结果
    computed: Record<string, any>;

    constructor(options: { name?: string, [k: string]: any }) {
        this.options = { ...(<any>this.constructor).DEFAULT_OPTIONS, disabled: false, ...options };
        this.name = this.options.name;
        this.disabled = this.options.disabled;
        this.status = STATUS_POSSIBLE;
        this.isRecognized = false;
        this.event = {};
        this.computed = {};
        this.recognizerMap = {};
        // 这里面不能直接调用$root等, 
        // 因为rollup生成的代码构造函数并不是该constructor
        // 而是构造函数中又嵌套了一个同名构造函数
    };

    /**
     * 设置识别器
     * @param {Object} 选项 
     */
    set(options = {}) {
        this.options = { ...this.options, ...options };
        // 刷新anyTouch
        this.$root.update();
        return this;
    };

    /**
     * 传入启动类的实例
     * @param $root 
     */
    $mixin($root: any): Recognizer {
        this.$root = $root;
        this.$store = $root.$store;
        return this;
    }

    /**
     * 对eventEmitter进行封装
     * @param type 
     * @param payload 
     */
    emit(type: string, payload: any) {
        payload.type = type;
        this.$root.eventEmitter.emit(type, payload);
        if (void 0 !== this.$root.el) {
            if (this.$root.options.syncToAttr) {
                this.$root.el.setAttribute('at-gesture', type);
            }
            if (this.$root.options.hasDomEvents) {
                // 过滤掉几个Event上保留的字段
                let { target, currentTarget, type, ...data } = payload;
                let event = new Event(type, payload);
                Object.assign(event, data);
                this.$root.el.dispatchEvent(event);
            }
        }
    };

    /**
     * 验证触点
     * @param {Number} 触点数
     */
    isValidPointLength(pointLength: number): boolean {
        return 0 === this.options.pointLength || this.options.pointLength === pointLength;
    };

    /**
     * 是否只支持水平方向
     */
    isOnlyHorizontal() {
        let isOnlyHorizontal = true;
        for (let direction of this.options.directions) {
            isOnlyHorizontal = -1 < DIRECTION_X.indexOf(direction);
            if (!isOnlyHorizontal) {
                return false;
            }
        }
        return isOnlyHorizontal;
    };

    /**
     * 是否只支持垂直方向
     */
    isOnlyVertical() {
        let isOnlyVertical = true;
        for (let direction of this.options.directions) {
            isOnlyVertical = -1 < DIRECTION_Y.indexOf(direction);
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
    isVaildDirection(direction?: directionString) {
        return -1 !== this.options.directions.indexOf(direction) || NONE === direction;
    };

    flow(isVaild: boolean, activeStatus: string, touchDevice: string): string {
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
    protected _resetStatus(): void {
        // if (this.name === 'tap') console.log('@', this.status);
        //STATUS_RECOGNIZED === STATUS_END
        if (-1 !== [STATUS_END, STATUS_CANCELLED, STATUS_RECOGNIZED, STATUS_FAILED].indexOf(this.status)) {
            this.status = STATUS_POSSIBLE;
        };
    };

    /**
     * 缓存计算函数的结果
     * 如果已存在, 那么跳过计算
     * 注意:
     * 为了避免压缩后函数名发生变化, 所以必须搭配_getComputed使用.
     * 不确定Function.name是不是在所有环境下都ok,暂时参考MDN上的说明, 好像没问题.
     * https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/name
     * 计算函数也由于这个原因, 所以即便export defalut也指定了函数名
     * @param {Function} 计算函数 
     * @param {Array} 计算函数的参数
     */
    protected _getComputed(fn: (...args: any[]) => any, ...args: any[]) {
        const { name } = fn;
        this.computed[name] = this.computed[name] || fn(...args);
        return this.computed[name];
    };


    /**
     * 适用于大部分移动类型的手势, 
     * 如pan/rotate/pinch/swipe
     * @param {InputRecord} 输入记录 
     */
    recognize(inputRecord: InputRecord): void {
        // if(!computed.isStart) return;
        // if(this.name === 'pan')    console.log(this.name,this.status);
        // 是否识别成功
        const isVaild = this.test(inputRecord);
        // 重置status
        this._resetStatus();

        // 状态变化流程
        const { input } = inputRecord;
        const { eventType } = input;

        this.status = this.flow(isVaild, this.status, eventType);
        const { event } = this;
        if (STATUS_CANCELLED === eventType) {
            this.emit(this.options.name + INPUT_CANCEL, event);
            return;
        }

        // 是否已识别
        this.isRecognized = -1 < [STATUS_START, STATUS_MOVE, STATUS_END, STATUS_RECOGNIZED].indexOf(this.status);
        // 识别后触发的事件
        if (isVaild) {
            this.afterRecognized(event);

            // computed = this.lockDirection(computed);
            this.emit(this.options.name, event);

            // panstart | panmove 等
            this.emit(this.options.name + this.status, event);

            this.afterEmit();
        } else if (this.isRecognized) {

            // panend等
            this.emit(this.options.name + this.status, event);

        }
    };

    /**
     * 校验输入数据
     * @param {InputRecord} 计算数据
     * @returns {Boolean} 校验结果
     */
    abstract test(inputRecord: InputRecord): boolean;

    /**
     * 识别成功后执行
     * 这个阶段可以对computed数据做些处理
     * 比如pan可以针对不支持的方向吧deltaX/Y调整为0
     * swipe可以把不支持的方向上的速率调整为0
     * @param {AnyTouchEvent} 计算数据 
     */
    afterRecognized(computed: any): void { };

    /**
     * 基类的所有emit触发后执行
     * @param {AnyTouchEvent} computed 
     */
    afterEmit(): void { };

    /**
     * 计算当前手势的touch-action
     */
    abstract getTouchAction(): string[];


};

