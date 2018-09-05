import session from './session';
import compute from './compute';
export default function (event: TouchEvent) {
    const pointers = event.touches;
    const length  = pointers.length;
    const changedPointers = event.changedTouches;
    const { now } = Date;
    session.input.length = length;
    session.input.isStart = session.input.isEnd;
    session.input.isEnd = 0 === length;
    session.input.isMove = !session.input.isStart && !session.input.isEnd;
    // 上一步的触点
    session.input.prevPointers = session.input.activePointers;
    // 起始点
    if (session.input.isStart) {
        session.input.startPointers = pointers;
        session.input.startTime = now();
    }

    // 当前点
    session.input.activePointers = pointers;
    session.input.activeTime = now();

    // 每300ms重新计算startPointers, startTime
    // 用来识别当用户按住屏幕一段时间才开始操作的手势
    if(session.input.isMove && 300 < session.input.activeTime - session.input.startTime) {
        session.input.startPointers = pointers;
        session.input.startTime = now();
    }


    // 结束点
    if (session.input.isEnd) {
        session.input.activePointers = changedPointers;
        session.input.endPointers = changedPointers;
        session.input.endTime = now();
    }

    session.computed = compute(session.input);
    return session.input;
};