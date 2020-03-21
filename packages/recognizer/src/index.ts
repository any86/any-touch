import { Input, ComputeConstructor } from '@any-touch/shared';
import {
    STATUS_POSSIBLE, SupportStatus
} from '@any-touch/shared';

// 导出recognizeForPressMoveLike,
// resetStatusForPressMoveLike
export { default as recognizeForPressMoveLike } from './recognizeForPressMoveLike';
export { default as resetStatusForPressMoveLike } from './resetStatusForPressMoveLike';


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
    disabled: boolean;
    // 识别状态
    status: SupportStatus;
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
    computeInstanceMap: Record<string, any>;

    // 当前输入
    input?: Input;

    constructor(options: { name: string, [k: string]: any }) {
        this.options = options;
        this.name = this.options.name;
        this.disabled = false;
        this.status = STATUS_POSSIBLE;
        this.isRecognized = false;

        this.computed = {};
        this.computedGroup = {};
        this.computeInstanceMap = {};

        this.recognizerMap = {};
    };


    /**
     * 设置识别器
     * @param {Object} 选项 
     */
    set(options?: Record<string, any>) {
        if (void 0 !== options) {
            this.options = { ...this.options, ...options };
        }
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
     * @param Cs 计算函数 
     * @param input 计算函数的参数
     */
    protected compute<T extends GenComputeFunction>(Cs: T[], input: Input): UnionToIntersection<Exclude<ReturnType<ReturnType<T>>, void>> {
        const computed = Object.create(null);
        for (const C of Cs) {
            const { _id } = C;
            // computedGroup 键为函数名(_id), 值为计算结果
            const { computedGroup, computeInstanceMap } = this;
            if (void 0 === computeInstanceMap[_id]) {
                // 缓存初始化后的实例
                computeInstanceMap[_id] = C();
            }
            // 缓存计算结果
            computedGroup[_id] = computedGroup[_id] || computeInstanceMap[_id](input);
            for (const key in computedGroup[_id]) {
                computed[key] = computedGroup[_id][key];
            }
        }
        return computed;
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

