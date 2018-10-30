import Base from './Base';
export default class PanRecognizer extends Base {
    constructor({ name = 'pan', threshold = 10, allowLength = 1 } = {}) {
        super({ name });
        this.name = name;
        this.threshold = threshold;
        this.allowLength = allowLength;
    }
    ;
    recognize(computed, callback) {
        let type;
        if (this.test(computed)) {
            callback(Object.assign({ type: this.name + computed.direction }, computed));
            callback(Object.assign({ type: this.name }, computed));
            type = this.recognizeType(computed.nativeEventType);
            callback(Object.assign({ type: this.name + type }, computed));
        }
    }
    ;
    test({ maxLength, distance, nativeEventType }) {
        return 'start' !== nativeEventType && (this.isRecognized || this.threshold < distance) && this.allowLength === maxLength;
    }
    ;
}
;
