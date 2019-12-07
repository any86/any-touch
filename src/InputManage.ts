import { BaseInput, Input, SupportEvent, InputRecord, Point } from '@/types';
import InputFactory from '@/Input';
import { getCenter } from '@/vector';

import { INPUT_END, INPUT_START, INPUT_CANCEL } from '@/const';
export default class {
    // 起点(单点|多点)
    startInput?: Input;
    // 前一次的触电
    prevInput?: Input;
    // 当前触点
    activeInput?: Input;
    // 多点触碰的起点
    startMultiInput?: Input;

    inputFactory: InputFactory;

    constructor() {
        this.inputFactory = new InputFactory();
    };

    /**
     * 读取事件对象
     * @param {SupportEvent} 支持传入的事件对象 
     * @returns {InputRecord} InputRecord
     */
    load(event: SupportEvent): InputRecord | void {
        // 格式化不同设备输入数据
        const input = this.inputFactory.load(event);
        // 过滤无效的输入
        if (void 0 !== input) {
            return this._record(input);
        }
    };

    /**
     * 记录计算所需的几个输入
     * @param {Input} 输入
     * @return {InputRecord} 输入记录
     */
    private _record(input: BaseInput): InputRecord {
        // 当前输入状态
        const computed = transform(input);
        const { isStart, pointLength } = computed;

        // 获取上一点
        this.prevInput = this.activeInput;

        if (isStart) {
            // 起点(单点|多点)
            this.startInput = computed;
            this.prevInput = void 0;
            // 起点(多点)
            if (1 < pointLength) {
                this.startMultiInput = computed;
            } else {
                // 如果出现了单点, 那么之前的多点起点记录失效
                this.startMultiInput = void 0;
            }
        }
        // 当前点
        this.activeInput = computed;

        return {
            startMultiInput: this.startMultiInput,
            startInput: <Input>this.startInput,
            prevInput: this.prevInput,
            input: computed
        };
    };
};

function transform(input: BaseInput): Input {
    const { eventType, points, changedPoints, nativeEvent } = input;
    const pointLength = points.length;
    const isStart = INPUT_START === eventType;
    const isEnd = (INPUT_END === eventType && 0 === pointLength) || INPUT_CANCEL === eventType;
    // 当前时间
    const timestamp = Date.now();
    // 触点中心
    // !!! 注意 !!!
    // 1. 此处的x,y和Touch事件的touchs不同, x,y代表发生事件的坐标,
    // 所以即便是touchend, 也会有x,y, 方便后续的位移和速度等计算.
    // 2. changedPoints 最少有一个点
    const { x, y } = getCenter(points) || getCenter(changedPoints) as Point;
    const { target, currentTarget } = nativeEvent;

    return {
        ...input,
        preventDefault: () => {
            nativeEvent.preventDefault();
        },
        x, y,
        timestamp,
        isStart, isEnd,
        pointLength,
        target,
        currentTarget,
    }
}