import { Recognizer, Input, ComputeConstructor } from '@types';
import {
    STATUS_POSSIBLE,
    STATUS_START,
    STATUS_MOVE,
    STATUS_END,
    STATUS_CANCELLED,
    STATUS_FAILED, STATUS_RECOGNIZED
} from '@any-touch/Recognizer/const'

export {
    STATUS_POSSIBLE,
    STATUS_START,
    STATUS_MOVE,
    STATUS_END,
    STATUS_CANCELLED,
    STATUS_FAILED, STATUS_RECOGNIZED
};

export default abstract class RecognizerBase {
    // 给use方法用
    static type = 'Recognizer';
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

    recognizerMap: Record<string, Recognizer>;
    // 缓存当前手势的计算结果
    // 每次手势识别前, 
    // 会把前面所有手势的计算结果作为当前计算结果
    computedGroup: Record<string, any>;

    computed: Record<string, any>;

    // 使用过的计算函数
    usedComputeFunctionMap: Record<string, any>;

    // 当前输入
    input?: Input;


    constructor(options: { name?: string, [k: string]: any }) {
        this.options = { ...(<any>this.constructor).DEFAULT_OPTIONS, disabled: false, ...options };
        this.name = this.options.name;
        this.disabled = this.options.disabled;
        this.status = STATUS_POSSIBLE;
        this.isRecognized = false;

        this.computed = {};
        this.computedGroup = {};
        this.usedComputeFunctionMap = {};

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
        return this;
    };

    /**
     * 验证触点
     * @param {Number} 触点数
     */
    isValidPointLength(pointLength: number): boolean {
        return 0 === this.options.pointLength || this.options.pointLength === pointLength;
    };

    /**
     * 缓存计算函数的结果
     * 注意:
     * 为了避免压缩后函数名发生变化, 所以default export后面必须跟着类名
     * https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/name
     * @param {StdClass[]} 计算函数 
     * @param {Array} 计算函数的参数
     */
    protected compute(Cs: ComputeConstructor[], ...args: any[]): unknown {
        let flatMap = Object.create(null);
        for (const C of Cs) {
            const { name } = C;
            const { computedGroup, usedComputeFunctionMap } = this;
            if (void 0 === usedComputeFunctionMap[name]) {
                // 缓存初始化后的实例
                usedComputeFunctionMap[name] = new C();
            }

            // 缓存计算结果
            computedGroup[name] = computedGroup[name] || usedComputeFunctionMap[name].compute(...args);
            flatMap = { ...flatMap, ...computedGroup[name] }
        }
        // 本次的事件对象, 此时没有type字段
        this.computed = flatMap;
        return flatMap;
    };

    /**
     * 适用于大部分移动类型的手势, 
     * 如pan/rotate/pinch/swipe
     * @param {Input} 输入记录 
     */
    abstract recognize(Input: Input, callback: (type: string, ...payload: any[]) => void): void;

    /**
     * 校验输入数据
     * @param {Input} 计算数据
     * @returns {Boolean} 校验结果
     */
    abstract test(input: Input): boolean;
};

