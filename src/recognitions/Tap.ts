import session from '../session';
import { MAX_MOVE_OF_TAP, propX, propY } from '../const';
import { AnyTouch, InputComputed } from '../interface';
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

    recognize(computedInput: any, callback: (paylod: any) => {}):void {
        if (this.test(computedInput)) {
            // 累加点击
            this.tapCount++;
            this.prevTapX = session.input.pointers[0][propX];
            this.prevTapY = session.input.pointers[0][propY];
            // 是否需要识别双击
            const hasDoubleTap = true;
            if (hasDoubleTap) {
                if(1 === this.tapCount) {
                    this.tapTimeout = window.setTimeout(()=>{
                        callback( { type: 'tap', ...computedInput});
                        this.tapCount = 0;
                    }, 200);
                } else {
                    clearTimeout(this.tapTimeout);
                    callback({ type: 'doubletap', ...computedInput});
                    this.tapCount = 0;
                }
            } else {
                callback({ type: 'tap', ...computedInput });
                this.tapCount = 0;
            }
        }
    };

    test(computedInput: any) {
        if ('end' === session.inputStatus) {
            let { distance, duration, maxLength } = computedInput;
            return 1 === maxLength &&  2 > distance && 250 > duration;
        }
    };
};