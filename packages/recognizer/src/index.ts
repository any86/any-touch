import type { Input, Computed, ComputeWrapFunction } from '@any-touch/shared';
import {
    STATUS_POSSIBLE, RecognizerStatus
} from '@any-touch/shared';

// 导出recognizeForPressMoveLike,
// resetStatusForPressMoveLike
export { default as recognizeForPressMoveLike } from './recognizeForPressMoveLike';
export { default as resetStatusForPressMoveLike } from './resetStatusForPressMoveLike';

// 联合变交叉
// type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never;

export default abstract class {
    // 手势名
    name: string;
    // 是否禁止
    disabled = false;
    // 是否已识别
    isRecognized = false;
    // 识别状态
    status: RecognizerStatus = STATUS_POSSIBLE;
    // 选项
    options: { [k: string]: any };

    recognizerMap: Record<string, this> = {};

    computeFunctions: ComputeWrapFunction[] = [];

    constructor(options: { name: string, [k: string]: number|string }) {
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

