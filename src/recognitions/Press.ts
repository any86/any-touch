export default class PressRecognizer {
    timeoutId: number;
    constructor() {
        this.timeoutId = null;
    };

    recognize(computed: any, callback: (paylod: any) => {}) {
        this.test(computed, callback)
    };

    test(computed: any, callback: (paylod: any) => {}) {
        if ('start' === computed.status) {
            this.timeoutId = window.setTimeout(() => {
                callback({ type: 'press', ...computed });
            }, 250);
        } else if ('move' === computed.status) {
            if (9 < computed.distance) {
                this.reset();
            }
        } else if ('end' === computed.status) {
            if (251 > computed.duration || 9 < computed.distance) {
                this.reset();
            }
        }
    }

    reset() {
        clearTimeout(this.timeoutId);
    }
};