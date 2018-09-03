import session from '../session';
export default class PressRecognizer {
    timeoutId: number;
    constructor() {
        this.timeoutId = null;
    };

    recognize(computedInput: any) {
        this.test(computedInput)
    };

    test(computedInput: any) {
        if (computedInput.isStart) {
            this.timeoutId = window.setTimeout(() => {
                session.eventBus.emit('press', { type: 'press', ...computedInput });
            }, 250);
        } else if (computedInput.isMove) {
            if (9 < computedInput.distance) {
                this.reset();
            }
        } else if (computedInput.isEnd) {
            if (251 > computedInput.duration || 9 < computedInput.distance) {
                this.reset();
            }
        }
    }

    reset() {
        clearTimeout(this.timeoutId);
    }
};