import { Computed, AnyInput } from '../interface';
import Input from '../input/index';
import compute from './compute';
let startInput: AnyInput;
let prevInput: AnyInput;
let activeInput: AnyInput;
export default function (event: any): Computed {
    // 格式化设备输入数据
    const input = new Input(event);
    // 当前输入状态
    const { nativeEventType } = input;

    // [Start]
    if ('start' === nativeEventType) {
        // 上一步的触点
        prevInput = undefined;
        // 当前点
        activeInput = input;
        // 起点(单点|多点)
        startInput = activeInput;
    }
    // [Move]
    else if ('move' === nativeEventType) {
        // 上一步的触点
        prevInput = activeInput;
        // 当前点
        activeInput = input;
    }
    // [End]
    else if ('end' === nativeEventType) {
        prevInput = activeInput;
        // 当前点
        activeInput = input;

    } else if ('cancel' === nativeEventType) {
        prevInput = activeInput;
        // 当前点
        activeInput = input;
    }
    const computed = compute({
        nativeEventType,
        startInput,
        prevInput,
        input,
    });

    return { ...input, ...computed, nativeEventType };
}; 