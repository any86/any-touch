import { Computed, AnyInput } from '../interface';
import Input from '../input/index';
import compute from './compute';
let startMultiInput: AnyInput;
let startInput: AnyInput;
let prevInput: AnyInput;

export default function (event: any): Computed {
    // 格式化设备输入数据
    const input = new Input(event);
    // 当前输入状态
    const { status } = input;
    // [Start]
    if ('start' === status) {
        // 清空缓存的多点起点数据
        startMultiInput = undefined;
        // 起点(单点|多点)
        startInput = input;
        // 上一步的触点
        prevInput = undefined;
    }
    // [Move]
    else if ('move' === status) {
        // 上一步的触点
        prevInput = input;
    }
    // [End]
    else if ('end' === status) {
        // end
    } else if ('cancel' === status) {
        //cancel;
    }

    // 开始多点触碰
    if (1 < length && undefined === startMultiInput) {
        startMultiInput = input;
    }

    // 如果多点变成单点, 那么单点的起点重置
    if (undefined !== prevInput && 1 < prevInput.pointers.length && 1 === input.pointers.length) {
        startInput = input;
    }


    const computed = compute({
        status,
        startInput,
        prevInput,
        input,
        startMultiInput,
    });

    return { ...input, ...computed, status };
}; 