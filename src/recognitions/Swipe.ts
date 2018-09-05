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
        const {max} = Math;
        const { velocityX, velocityY,duration, isEnd } = computedInput;
        return isEnd && 250 > duration &&  0.3 < max(velocityX, velocityY);
    };
};