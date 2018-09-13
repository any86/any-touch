import { InputComputed, AnyTouch } from './interface';
import InputFactory from './InputFactory';
import session from './session';
import compute from './compute';
import mouseInput from './input/mouse'
export default function (event: any): any {
    let pointers;
    let length;
    let changedPointers;
    const { type } = event;
    // Touch
    if ('ontouchstart' in window) {
        session.inputStatus = type.replace('touch', '');
        pointers = event.touches;
        length = pointers.length;
        changedPointers = event.changedTouches;
    }
    // Mouse
    else {
        const input = mouseInput(event);
        if (undefined === input) return;
        pointers = input.pointers;
        length = input.length;
        changedPointers = input.changedPointers;
    }

    // [Start]
    if ('start' === session.inputStatus) {
        // 清空缓存的多点起点数据
        session.startMultiInput = undefined;
        // 起点(单点|多点)
        session.startInput = new InputFactory(pointers);
        // 上一步的触点
        session.prevInput = undefined;
        // 当前触碰点
        session.input = new InputFactory(pointers);
    }
    // [Move]
    else if ('move' === session.inputStatus) {
        // 上一步的触点
        session.prevInput = session.input;
        // 当前触碰点
        session.input = new InputFactory(pointers);
    }
    // [End]
    else if ('end' === session.inputStatus) {
        session.endInput = new InputFactory(changedPointers);
    } else if ('cancel' === session.inputStatus) {
        //cancel;
    }

    // 开始多点触碰
    if (1 < length && undefined === session.startMultiInput) {
        session.startMultiInput = new InputFactory(pointers);
    }

    if (undefined !== session.prevInput && 1 < session.prevInput.pointers.length && 1 === session.input.pointers.length) {
        session.startInput = new InputFactory(pointers);
    }

    let {
        startInput,
        prevInput,
        input, startMultiInput
    } = session;

    const computed = compute({
        startInput,
        prevInput,
        input, startMultiInput,
    });
    return { ...input, ...computed };
}; 