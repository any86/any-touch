import session from '../session';
export default class RotateRecognizer {
    tapCount: number;
    tapTimeout: number;
    status: string;

    constructor() {
        this.tapTimeout = null;
        this.tapCount = 0;
    };

    recognize(computedInput: any) {
        if (this.test(computedInput)) {
            session.eventBus.emit('rotate', { type: 'rotate', ...computedInput });
        }
    };

    test(computedInput: any) {
        return 1 < computedInput.length;
    };
};