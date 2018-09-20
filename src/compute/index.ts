import { Computed } from '../interface';
import Input from '../input/index';
import session from '../session';
import compute from './compute';
export default function (event: any): Computed {
    const inputData = new Input(event);
    const { status } = inputData;
    // [Start]
    if ('start' === status) {
        // 清空缓存的多点起点数据
        session.startMultiInput = undefined;
        // 起点(单点|多点)
        session.startInput = inputData;
        // 上一步的触点
        session.prevInput = undefined;
        // 当前触碰点
        session.input = inputData;
    }
    // [Move]
    else if ('move' === status) {
        // 上一步的触点
        session.prevInput = session.input;
        // 当前触碰点
        session.input = inputData;
    }
    // [End]
    else if ('end' === status) {
        // session.endInput = inputData;
    } else if ('cancel' === status) {
        //cancel;
    }

    // 开始多点触碰
    if (1 < length && undefined === session.startMultiInput) {
        session.startMultiInput = inputData;
    }

    if (undefined !== session.prevInput && 1 < session.prevInput.pointers.length && 1 === session.input.pointers.length) {
        session.startInput = inputData;
    }

    let {
        startInput,
        prevInput,
        input,
        startMultiInput
    } = session;
    const computed = compute({
        startInput,
        prevInput,
        input,
        startMultiInput,
    });

    return { ...input, ...computed, status };
}; 