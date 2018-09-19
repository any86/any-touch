import session from '../session';
export default class PressRecognizer {
    timeoutId: number;
    constructor() {
        this.timeoutId = null;
    };

    recognize(computed: any, callback: (paylod: any) => {}) {
        this.test(computed, callback)
    };

    test(computed: any, callback: (paylod: any) => {}) {
        if ('start' === session.inputaction) {
            this.timeoutId = window.setTimeout(() => {
                callback({ type: 'press', ...computed });
            }, 250);
        } else if ('move' === session.inputaction) {
            if (9 < computed.distance) {
                this.reset();
            }
        } else if ('end' === session.inputaction) {
            if (251 > computed.duration || 9 < computed.distance) {
                this.reset();
            }
        }
    }

    reset() {
        clearTimeout(this.timeoutId);
    }
};