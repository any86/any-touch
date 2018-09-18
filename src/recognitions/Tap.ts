import session from '../session';
import { propX, propY } from '../const';
import { Computed, RecognizerCallback } from '../interface';
interface Options { hasDoubleTap: boolean };

export default class TapRecognizer {
    tapCount: number;
    tapTimeout: number;
    // 上一次tap的点击坐标
    prevTapX: number;
    prevTapY: number;
    hasDoubleTap: boolean;

    constructor({ hasDoubleTap }: Options) {
        this.tapTimeout = null;
        this.tapCount = 0;
        this.hasDoubleTap = hasDoubleTap;
    };

    recognize(computed: Computed, callback: RecognizerCallback): void {
        if (this.test(computed)) {
            // 累加点击
            this.tapCount++;
            this.prevTapX = session.input.pointers[0][propX];
            this.prevTapY = session.input.pointers[0][propY];
            // 是否需要识别双击
            if (this.hasDoubleTap) {
                if (1 === this.tapCount) {
                    this.tapTimeout = window.setTimeout(() => {
                        callback({ type: 'tap', ...computed });
                        this.tapCount = 0;
                    }, 200);
                } else {
                    clearTimeout(this.tapTimeout);
                    callback({ type: 'doubletap', ...computed });
                    this.tapCount = 0;
                }
            } else {
                callback({ type: 'tap', ...computed });
                this.tapCount = 0;
            }
        }
    };

    test({ status, distance, duration, maxLength }: Computed) {
        if ('end' === status) {
            return 1 === maxLength && 2 > distance && 250 > duration;
        }
    };
};