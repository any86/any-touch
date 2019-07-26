import { Input, SupportEvent, InputRecord, AnyTouchEvent,Store } from './interface';
import InputFactory from './input';
import compute from './compute/index';
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

    $store: Store;

    constructor({ $store }: { $store: Store }) {
        this.inputFactory = new InputFactory();
        this.$store = $store;
    };

    /**
     * 读取事件对象
     * @param {SupportEvent} 支持传入的事件对象 
     * @returns {AnyTouchEvent} AnyTouchEvent
     */
    load(event: SupportEvent): AnyTouchEvent | void {
        // 格式化不同设备输入数据
        const input = this.inputFactory.load(event);
        // 过滤无效的输入    
        if (undefined === input) return;
        const record = this._record(input);
        return compute(record, this.$store);
    };

    /**
     * 记录计算所需的几个输入
     * @param {Input} 输入
     * @return {InputRecord} 输入记录
     */
    private _record(input: Input): InputRecord {
        // 当前输入状态
        const { eventType } = input;
        // 获取上一点
        this.prevInput = this.activeInput;

        if ('start' === eventType) {
            // 起点(单点|多点)
            if (input.isStart) {
                this.startInput = input;
            }

            // 起点(多点)
            if (1 < input.pointLength) {
                this.startMultiInput = input;
            } else {
                // 如果出现了单点, 那么之前的多点起点记录失效
                this.startMultiInput = undefined;
            }
        }
        // 当前点
        this.activeInput = input;

        return {
            startMultiInput: this.startMultiInput,
            startInput: <Input>this.startInput,
            prevInput: this.prevInput,
            input
        };
    };
}; 