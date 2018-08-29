import session from './session';
export default function(event: TouchEvent) {
        const pointers = event.touches;
        const changedPointers = event.changedTouches;
        const { now } = Date;

        session.length = pointers.length;

        session.isStart = session.isEnd;
        session.isEnd = 0 === pointers.length;
        session.isMove = !session.isStart && !session.isEnd;
        // 上一步的触点
        session.prevPointers = session.activePointers;
        // 起始点
        if (session.isStart) {
            session.startPointers = pointers;
            session.startTime = now();
        }
        // 当前点
        session.activePointers = pointers;
        session.activeTime = now();
        // 结束点
        if (session.isEnd) {
            session.activePointers = changedPointers;
            session.endPointers = changedPointers;
            session.endTime = now();
        }

        return session;
};