import { Input, ComputeConstructor } from '@any-touch/shared';
import {
    STATUS_POSSIBLE,
} from '@any-touch/shared';

// 导出recognizeForPressMoveLike,
// resetStatusForPressMoveLike
export { default as recognizeForPressMoveLike } from './recognizeForPressMoveLike';
export { default as resetStatusForPressMoveLike } from './resetStatusForPressMoveLike';

export default abstract class{
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

    recognizerMap: Record<string, this>;
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
            const { _id } = C;
            const { computedGroup, usedComputeFunctionMap } = this;
            if (void 0 === usedComputeFunctionMap[_id]) {
                // 缓存初始化后的实例
                usedComputeFunctionMap[_id] = new C();
            }

            // 缓存计算结果
            computedGroup[_id] = computedGroup[_id] || usedComputeFunctionMap[_id].compute(...args);
            flatMap = { ...flatMap, ...computedGroup[_id] }
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
};

