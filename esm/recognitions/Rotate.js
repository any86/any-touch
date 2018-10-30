import Base from './Base';
export default class RotateRecognizer extends Base {
    constructor(options) {
        super(options);
    }
    ;
    recognize(computed, callback) {
        if (this.test(computed)) {
            callback(Object.assign({ type: 'rotate' }, computed));
            const type = this.recognizeType(computed.nativeEventType);
            callback(Object.assign({ type: 'rotate' + type }, computed));
        }
    }
    ;
    test({ length, nativeEventType }) {
        return 1 < length || ('end' === nativeEventType && this.isRecognized);
    }
    ;
}
;
