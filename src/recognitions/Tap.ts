import { Computed, RecognizerCallback } from '../interface';
interface Options { hasDoubleTap: boolean };

export default class TapRecognizer {
    tapCount: number;
    tapTimeout: number;
    // 上一次tap的点击坐标
    private _prevCenterX: number;
    private _prevCenterY: number;
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

    test({ nativeEventType, distance, duration, maxLength, centerX, centerY }: Computed): boolean {
        const { abs, max } = Math;
        // 判断是否发生大的位置变化
        this._prevCenterX = centerX;
        this._prevCenterY = centerY;
        let _xMove = abs(centerX - this._prevCenterX);
        let _yMove = abs(centerY - this._prevCenterY);
        const hasMove = 2 < max(_xMove, _yMove);
        if ('end' === nativeEventType) {
            return 1 === maxLength && 2 > distance && 250 > duration && !hasMove;
        }
    };
};