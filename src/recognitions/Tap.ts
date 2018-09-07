import session from '../session';
import { MAX_MOVE_OF_TAP, propX, propY } from '../const';
import { AnyInput, InputComputed } from '../interface';
export default class TapRecognizer {
    tapCount: number;
    tapTimeout: number;
    // 上一次tap的点击坐标
    prevTapX: number;
    prevTapY: number;

    constructor() {
        this.tapTimeout = null;
        this.tapCount = 0;

    };

    recognize(computedInput: any) {
        if (this.test(computedInput)) {
            // 累加点击
            this.tapCount++;
            this.prevTapX = computedInput.validPointers[0][propX];
            this.prevTapY = computedInput.validPointers[0][propY];
            // 是否需要识别双击
            const hasDoubleTap = session.eventBus.has('doubletap');
            if (hasDoubleTap) {
                if(1 === this.tapCount) {
                    this.tapTimeout = window.setTimeout(()=>{
                        session.eventBus.emit('tap', { type: 'tap', ...computedInput});
                        this.tapCount = 0;
                    }, 200);
                } else {
                    clearTimeout(this.tapTimeout);
                    session.eventBus.emit('doubletap', { type: 'doubletap', ...computedInput});
                    this.tapCount = 0;
                }
            } else {
                session.eventBus.emit('tap', { type: 'tap', ...computedInput });
                this.tapCount = 0;
            }
        }
    };

    test(computedInput: any) {
        if (computedInput.isEnd) {
            let { distance, duration } = computedInput;
            return 2 > distance && 250 > duration;
        }
    };
};