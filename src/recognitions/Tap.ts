import { Computed, RecognizerCallback } from '../interface';
interface Options { name: string, pointer: number, taps: number };
import Base from './Base';
export default class TapRecognizer extends Base {
    tapCount: number;
    tapTimeoutId: number;
    // 上一次tap的点击坐标
    private _prevCenterX: number;
    private _prevCenterY: number;
    public options: Options;

    constructor(options: Options) {
        super();
        this.options = options;
        this.tapTimeoutId = null;
        this.tapCount = 0;
    };

    recognize(computed: Computed, callback: RecognizerCallback): void {
        if (this.test(computed)) {
            // console.log(this.tapCount);
            // 累加点击
            this.tapCount++;
            callback({ type: this.options.name, ...computed, tapCount:this.tapCount });
            clearTimeout(this.tapTimeoutId);
            this.tapTimeoutId = window.setTimeout(() => {
                this.tapCount = 0;
            }, 300);
        }
    };

    cancelTap() {
        clearTimeout(this.tapTimeoutId);
        this.tapCount = 0;
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