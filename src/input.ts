import { InputComputed, AnyTouch } from './interface';
import { MAX_MOVE_OF_TAP, propX, propY } from './const';

import InputFactory from './InputFactory';

import session from './session';
import compute from './compute';
export default function (event: TouchEvent): any {
    const pointers = event.touches;
    const length = pointers.length;
    const changedPointers = event.changedTouches;
    const { max } = Math;
    // 判断当前状态
    session.isStart = session.isEnd;
    session.isEnd = 0 === length;
    session.isMove = !session.isStart && !session.isEnd;

    

    // [Start]
    if (session.isStart) {
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
    else if (session.isMove) {
        // 上一步的触点
        session.prevInput = session.input;
        // 当前触碰点
        session.input = new InputFactory(pointers);
    }
    // [End]
    else if (session.isEnd) {
        session.endInput = new InputFactory(changedPointers);
    }

    session.validInput = 0 === session.input.pointers.length ? session.prevInput : session.input;

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
        validInput: session.validInput
    });
    return { ...input, ...computed };
}; 