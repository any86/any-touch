import session from './session';
export default function (event: TouchEvent) {
    const pointers = event.touches;
    const length = pointers.length;
    const changedPointers = event.changedTouches;
    const { now } = Date;
    const { max } = Math;

    // 触碰点数
    session.input.length = length;

    // 判断当前状态
    session.input.isStart = session.input.isEnd;
    session.input.isEnd = 0 === length;
    session.input.isMove = !session.input.isStart && !session.input.isEnd;

    // 上一步的触点
    session.input.prevPointers = session.input.activePointers;

    // [Start]
    if (session.input.isStart) {
        // 记录起点信息
        session.input.startPointers = pointers;
        session.input.startTime = now();
    }
    // [Move]
    else if (session.input.isMove) {
        // 当从多点触碰变为单点
        // 该位置的代码完全是为了当pinch/rotate后进行pan操作的时候,
        // 让distance相关能够以变为单点后的坐标进行计算
        const isMultiToSingle = 1 < session.input.prevPointers.length && 1 === session.input.length;

        // 每300ms重新计算startPointers, startTime
        // 用来识别当用户按住屏幕一段时间才开始操作的手势
        const isLongHold = 300 < session.input.activeTime - session.input.reStartTime;
        if (isMultiToSingle || isLongHold) {
            // 新起点
            session.input.reStartPointers = pointers;
            session.input.reStartTime = now();
        }
    }
    // [End]
    else if (session.input.isEnd) {
        session.input.endPointers = changedPointers;
        session.input.endTime = now();
    }

    // 当前点数据
    session.input.activePointers = pointers;
    session.input.activeTime = now();

    // 可用点, 当end阶段为离开时候的点
    session.input.validPointers = 0 < session.input.activePointers.length ? session.input.activePointers : session.input.endPointers;

    // 出现过的最大触点数量
    if (undefined === session.input.maxLength) {
        session.input.maxLength = length;
    } else {
        session.input.maxLength = max(session.input.maxLength, length);
    }
    return session.input;
}; 