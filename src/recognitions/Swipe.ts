import Base from './Base';
export default class SwipeRecognizer extends Base {
    public name: string;

    constructor(options:any) {
        super(options);
        this.name = 'swipe'
    };

    recognize(computed: any, callback: (paylod: any) => {}): void {
        if (this.test(computed)) {
            callback({ type: this.name, ...computed });

            callback({ type: this.name + computed.lastDirection, ...computed });

        }
    };

    test(computed: any): boolean {
        const { inputState, lastDirection, direction, lastVelocity, maxLength, distance } = computed;
        return 1 === maxLength &&
            10 < distance &&
            'end' === inputState &&
            'none' !== lastDirection &&
            'none' !== direction &&
            0.3 < lastVelocity;
    };
};