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

    // 上一步的触点
    session.prevInput = session.input;

    // [Start]
    if (session.isStart) {
        // 记录起点信息
        session.startInput = new InputFactory(pointers);
        // 清空上一点和最终点
        session.prevInput = undefined;
    }
    // [Move]
    else if (session.isMove) {
        // 当从多点触碰变为单点
        // 该位置的代码完全是为了当pinch/rotate后进行pan操作的时候,
        // 让distance相关能够以变为单点后的坐标进行计算
        // const isMultiToSingle = 1 < session.prevInput.length && 1 === session.length;

        // 每300ms重新计算startInput, startTime
        // 用来识别当用户按住屏幕一段时间才开始操作的手势
        // const isLongHold = 300 < session.activeTime - session.reStartTime;
        // if (isMultiToSingle) {
        // 新起点
        // session.reStartPointers = pointers;
        // session.reStartTime = now();
        // }
    }
    // [End]
    else if (session.isEnd) {
        session.endInput = new InputFactory(changedPointers);
        // if(1 < session.lastInputArray.length){
        //     session.penultInput = session.lastInputArray[0];
        // } else {
        //     session.penultInput = undefined;
        // }
    }

    // 当前触碰点
    session.input = new InputFactory(pointers);


    // 出现过的最大触点数量
    if (undefined === session.maxLength) {
        session.maxLength = length;
    } else {
        session.maxLength = max(session.maxLength, length);
    }

    const { 
        startInput,
        prevInput,
        input,
        maxLength } = session;

    const computed = compute({
        startInput,
        prevInput,
        input,
        maxLength
    });
    // console.log(session);
    return { ...input, ...computed };
}; 