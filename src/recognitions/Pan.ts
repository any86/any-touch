import session from '../session';
export default class PanRecognizer {
    constructor() {

    };

    recognize(computedInput: any) {
        if (this.test(computedInput)) {
            session.eventBus.emit('pan', ({ type: 'pan', ...computedInput }));
        }
    };

    test(computedInput: any) {
        const { length, distance } = computedInput;
        return 1 === length && 10 < distance;
    };
};