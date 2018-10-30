import Base from './Base';
export default class SwipeRecognizer extends Base {
    constructor(options) {
        super(options);
        this.name = 'swipe';
    }
    ;
    recognize(computed, callback) {
        if (this.test(computed)) {
            callback(Object.assign({ type: this.name }, computed));
            callback(Object.assign({ type: this.name + computed.lastDirection }, computed));
        }
    }
    ;
    test(computed) {
        const { nativeEventType, lastDirection, direction, lastVelocity, maxLength, distance } = computed;
        return 1 === maxLength &&
            10 < distance &&
            'end' === nativeEventType &&
            'none' !== lastDirection &&
            'none' !== direction &&
            0.3 < lastVelocity;
    }
    ;
}
;
