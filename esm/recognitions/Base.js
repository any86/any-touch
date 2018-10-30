export default class Recognizer {
    constructor(options) {
        this.name = options.name;
        this.status = 'unknown';
        this.isRecognized = false;
        this.requireFailureRecognizers = [];
    }
    ;
    requireFailure(recognizer) {
        if (!this.requireFailureRecognizers.includes(recognizer)) {
            this.requireFailureRecognizers.push(recognizer);
        }
    }
    ;
    hasRequireFailure() {
        return 0 < this.requireFailureRecognizers.length;
    }
    ;
    isOtherFailOrWait() {
        const { length } = this.requireFailureRecognizers;
        for (let index = 0; index < length; index++) {
            const recognizer = this.requireFailureRecognizers[index];
            if ('fail' !== recognizer.status && 'unknown' !== recognizer.status) {
                return false;
            }
        }
        ;
        return true;
    }
    ;
    recognizeType(nativeEventType) {
        if (this.isRecognized) {
            if ('move' === nativeEventType) {
                return 'move';
            }
            else {
                this.isRecognized = false;
                return 'end';
            }
        }
        else {
            this.isRecognized = true;
            return 'start';
        }
    }
    ;
}
;
