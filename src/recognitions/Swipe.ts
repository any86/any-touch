export default class SwipeRecognizer {
    public name: string;

    constructor() {
        this.name = 'swipe'
    };

    recognize(computed: any, callback: (paylod: any) => {}): void {
        if (this.test(computed)) {
            // console.log(computed);
            // swipeleft | swiperight | swipedown | swipeup
            // console.log(computed.lastDirection);
            callback({ type: this.name + computed.lastDirection, ...computed });

            callback({ type: this.name, ...computed });
        }
    };

    test(computed: any): boolean {
        const { nativeEventType, lastDirection, direction, lastVelocity, maxLength, distance } = computed;
        return 1 === maxLength &&
            10 < distance &&
            'end' === nativeEventType &&
            'none' !== lastDirection &&
            'none' !== direction &&
            0.3 < lastVelocity;
    };
};