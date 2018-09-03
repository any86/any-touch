import session from '../session';
export default class TapRecognizer {
    tapCount: number;
    tapTimeout: number;
    status: string;

    constructor() {
        this.tapTimeout = null;
        this.tapCount = 0;
    };

    recognize(computedInput: any) {
        if (this.test(computedInput)) {
            session.eventBus.emit('tap', { type: 'tap', ...computedInput });
        }
    };

    test(computedInput: any) {
        if (computedInput.isEnd) {
            let {distance, duration} = computedInput;
            return 2 > distance && 250 > duration;
        }
    };
};