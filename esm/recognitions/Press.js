import Base from './Base';
export default class PressRecognizer extends Base {
    constructor(options) {
        super(options);
        this.timeoutId = null;
    }
    ;
    recognize(computed, callback) {
        const { nativeEventType, distance, duration, maxLength } = computed;
        if (1 < maxLength) {
            this.cancel();
            return;
        }
        else {
            if ('start' === nativeEventType) {
                this.timeoutId = window.setTimeout(() => {
                    callback(Object.assign({ type: 'press' }, computed));
                }, 250);
            }
            else if ('move' === nativeEventType) {
                if (9 < distance) {
                    this.cancel();
                }
            }
            else if ('end' === nativeEventType) {
                if (251 > duration || 9 < distance) {
                    this.cancel();
                }
                else {
                    callback(Object.assign({ type: 'pressup' }, computed));
                }
            }
        }
    }
    ;
    cancel() {
        clearTimeout(this.timeoutId);
    }
}
;
