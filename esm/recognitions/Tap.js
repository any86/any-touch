;
const { setTimeout, clearTimeout } = window;
import Base from './Base';
export default class TapRecognizer extends Base {
    constructor(options) {
        super(options);
        this.options = options;
        this.tapTimeoutId = null;
        this.tapCount = 0;
    }
    ;
    recognize(computed, callback) {
        if (this.test(computed)) {
            this.tapCount++;
            if (this.hasRequireFailure()) {
                clearTimeout(this.tapTimeoutId);
                this.tapTimeoutId = setTimeout(() => {
                    if (this.options.taps === this.tapCount && this.isOtherFailOrWait()) {
                        callback(Object.assign({ type: this.options.name }, computed, { tapCount: this.tapCount }));
                    }
                    this.tapCount = 0;
                }, 300);
            }
            else {
                clearTimeout(this.tapTimeoutId);
                if (this.options.taps === this.tapCount) {
                    callback(Object.assign({ type: this.options.name }, computed, { tapCount: this.tapCount }));
                    this.tapCount = 0;
                }
                this.tapTimeoutId = setTimeout(() => {
                    this.status = 'fail';
                    this.tapCount = 0;
                }, 300);
            }
        }
    }
    ;
    cancelTap() {
        clearTimeout(this.tapTimeoutId);
        this.tapCount = 0;
    }
    ;
    test({ nativeEventType, distance, duration, maxLength, centerX, centerY }) {
        const { abs, max } = Math;
        this._prevCenterX = centerX;
        this._prevCenterY = centerY;
        let _xMove = abs(centerX - this._prevCenterX);
        let _yMove = abs(centerY - this._prevCenterY);
        const hasMove = 2 < max(_xMove, _yMove);
        if ('end' === nativeEventType) {
            return 1 === maxLength && 2 > distance && 250 > duration && !hasMove;
        }
    }
    ;
}
;
