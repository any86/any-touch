import session from '../session';
export default class PressRecognizer {
    timeoutId: number;
    constructor() {
        this.timeoutId = null;
    };

    recognize(computedinput: any, callback: (paylod: any) => {}) {
        this.test(computedinput, callback)
    };

    test(computedinput: any, callback: (paylod: any) => {}) {
        if ('start' === session.inputStatus) {
            this.timeoutId = window.setTimeout(() => {
                callback({ type: 'press', ...computedinput });
            }, 250);
        } else if ('move' === session.inputStatus) {
            if (9 < computedinput.distance) {
                this.reset();
            }
        } else if ('end' === session.inputStatus) {
            if (251 > computedinput.duration || 9 < computedinput.distance) {
                this.reset();
            }
        }
    }

    reset() {
        clearTimeout(this.timeoutId);
    }
};