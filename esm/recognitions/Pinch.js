import Base from './Base';
export default class PinchRecognizer extends Base {
    constructor(options) {
        super(options);
    }
    ;
    recognize(computed, callback) {
        if (this.test(computed)) {
            callback(Object.assign({ type: 'pinch' }, computed));
            const type = this.recognizeType(computed.nativeEventType);
            callback(Object.assign({ type: 'pinch' + type }, computed));
            const { scale } = computed;
            if (1 !== scale) {
                const inOrOut = scale > this._prevScale ? 'out' : 'in';
                if ('move' === type) {
                    callback(Object.assign({ type: 'pinch' + inOrOut }, computed));
                    this._prevScale = scale;
                }
            }
        }
    }
    ;
    test({ length, nativeEventType }) {
        return 1 < length || ('end' === nativeEventType && this.isRecognized);
    }
    ;
}
;
