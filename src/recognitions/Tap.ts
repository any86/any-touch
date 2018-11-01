import { Computed, RecognizerCallback } from '../interface';
interface Options { name: string, pointer: number, taps: number };
const { setTimeout, clearTimeout } = window;
import Base from './Base';
export default class TapRecognizer extends Base {
    tapCount: number;
    tapTimeoutId: number;
    // 上一次tap的点击坐标
    private _prevCenterX: number;
    private _prevCenterY: number;
    public options: Options;

    constructor(options: Options) {
        super(options);
        this.options = options;
        this.tapTimeoutId = null;
        this.tapCount = 0;
    };

    recognize(computed: Computed, callback: RecognizerCallback): void {
        if (this.test(computed)) {
            // 累加点击
            this.tapCount++;
            if (this.hasRequireFailure()) {
                
                // 如果是需要其他手势失败才能触发的手势,
                // 需要等待(300ms)其他手势失败才能触发
                clearTimeout(this.tapTimeoutId);
                this.tapTimeoutId = setTimeout(() => {
                    // console.log(this.isOtherFailOrWait());
                    if (this.options.taps === this.tapCount && this.isOtherFailOrWait()) {
                        callback({ ...computed, tapCount: this.tapCount,type: this.options.name });
                    }
                    this.tapCount = 0;
                }, 300);
            } else {
                // 如果不需要等待其他手势失败
                // 那么立即执行
                clearTimeout(this.tapTimeoutId);
                if (this.options.taps === this.tapCount) {
                    callback({ ...computed, tapCount: this.tapCount, type: this.options.name });
                    
                    this.tapCount = 0;
                }
                this.tapTimeoutId = setTimeout(() => {
                    this.status = 'fail';
                    this.tapCount = 0;
                }, 300)
            }
        }
    };

    cancelTap() {
        clearTimeout(this.tapTimeoutId);
        this.tapCount = 0;
    };

    test({ inputStatus, distance, duration, maxPointerLength, centerX, centerY }: Computed): boolean {
        const { abs, max } = Math;
        // 判断是否发生大的位置变化
        this._prevCenterX = centerX;
        this._prevCenterY = centerY;
        let _xMove = abs(centerX - this._prevCenterX);
        let _yMove = abs(centerY - this._prevCenterY);
        const hasMove = 2 < max(_xMove, _yMove);
        if ('end' === inputStatus) {
            return 1 === maxPointerLength && 2 > distance && 250 > duration && !hasMove;
        }
    };
};