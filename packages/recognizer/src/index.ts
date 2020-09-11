import { Input, Computed } from '@any-touch/shared';
import {
    STATUS_POSSIBLE, RecognizerStatus
} from '@any-touch/shared';

// 导出recognizeForPressMoveLike,
// resetStatusForPressMoveLike
export { default as recognizeForPressMoveLike } from './recognizeForPressMoveLike';
export { default as resetStatusForPressMoveLike } from './resetStatusForPressMoveLike';

// 联合变交叉
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never;


interface ComputeFunction {
    (input: Input): Record<string, any> | void;
}

interface GenComputeFunction {
    (): ComputeFunction;
    _id: string;
}

export default abstract class {
    // 手势名
    name: string;
    // 是否禁止
    disabled = false;
    // 识别状态
    status: RecognizerStatus = STATUS_POSSIBLE;
    // 是否已识别
    isRecognized: boolean = false;
    // 选项
    options: { [propName: string]: any };

    recognizerMap: Record<string, this> = {};
    // 缓存当前手势的计算结果
    // 每次手势识别前, 
    // 会把前面所有手势的计算结果作为当前计算结果
    computedGroup: Record<string, any> = {};
    computed: Record<string, any> = {};
    // 使用过的计算函数
    computeFunctionMap: Record<string, any> = {};

    // 当前输入
    input?: Input;

    computeFunctions:any[] = [];

    constructor(options: { name: string, [k: string]: any }) {
        this.options = options;
        this.name = this.options.name;
    };

    /**
     * 设置识别器
     * @param options 选项 
     */
    set(options?: Record<string, any>) {
        if (void 0 !== options) {
            this.options = { ...this.options, ...options };
        }
        return this;
    };

    /**
     * 验证触点数量
     * @param pointLength 触点数
     */
    isValidPointLength(pointLength: number): boolean {
        return this.options.pointLength === pointLength;
        // return 0 === this.options.pointLength || this.options.pointLength === pointLength;
    };


    /**
     * 适用于大部分移动类型的手势, 
     * 如pan/rotate/pinch/swipe
     * @param computed 计算值 
     */
    abstract recognize(computed: Computed, callback: (type: string, ...payload: any[]) => void): void;


    /**
     * 校验输入数据
     * @param {Input} 计算数据
     * @returns {Boolean} 校验结果
     */
    abstract test(input: Input): boolean;
};

