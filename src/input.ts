import session from './session';
import compute from './compute';
export default function (event: TouchEvent) {
    const pointers = event.touches;
    const length = pointers.length;
    const changedPointers = event.changedTouches;
    const { now } = Date;
    session.input.length = length;
    session.input.isStart = session.input.isEnd;
    session.input.isEnd = 0 === length;
    session.input.isMove = !session.input.isStart && !session.input.isEnd;

    // 第一下触碰, 不是touchstart, 是手势识别后的第一次触碰
    // session.input.firstTouch = pointers;

    // 上一步的触点
    session.input.prevPointers = session.input.activePointers;
    // [Start]
    // 起始点
    if (session.input.isStart) {
        session.input.startPointers = pointers;
        session.input.startTime = now();
    }

    // [Move]
    // 重新计算起始信息
    // 每300ms重新计算startPointers, startTime
    // // 用来识别当用户按住屏幕一段时间才开始操作的手势
    // if (session.input.isMove && 300 < session.input.activeTime - session.input.startTime) {
    //     session.input.startPointers = pointers;
    //     session.input.startTime = now();
    // }

    
    if (session.input.isMove) {
        if (1 < session.input.prevPointers.length && 1 === session.input.length) {
            // 该出的代码完全是为了当pinch/rotate后进行pan操作的时候,
            // 让distance相关能够以变为单点后的坐标进行计算
            // 当从多点触碰变为单点
            session.input.startPointers = pointers;
        }
    }

    // 当前点
    session.input.activePointers = pointers;
    session.input.activeTime = now();


    // [End]
    // 结束点
    if (session.input.isEnd) {

        session.input.activePointers = pointers;
        session.input.endPointers = changedPointers;
        session.input.endTime = now();
    }



    session.computed = compute(session.input);
    return session.input;
};