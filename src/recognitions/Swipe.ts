import session from '../session';
export default class SwipeRecognizer {
    constructor() {

    };

    recognize(computedInput: any) {
        if (this.test(computedInput)) {
            session.eventBus.emit('swipe', ({ type: 'swipe', ...computedInput }))
        }
    };

    test(computedInput: any) {
        const { length, distance, velocityX, velocityY,duration } = computedInput;
        return 1 === length && 250 > duration &&  (0.3 < velocityX || 0.3 < velocityY);
    };
};