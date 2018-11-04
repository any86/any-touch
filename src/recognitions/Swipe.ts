import Base from './Base';
import { Computed } from '../interface';
export default class SwipeRecognizer extends Base {
    public name: string;

    constructor(options: any) {
        super(options);
        this.name = 'swipe'
    };

    recognize(computed: Computed): void {
        if (this.test(computed)) {
            this.emit(this.name, computed);
            this.emit(this.name + computed.lastDirection, computed);
        }
    };

    test(computed: any): boolean {
        const { inputStatus, lastDirection, direction, lastVelocity, maxPointerLength, distance } = computed;
        return 1 === maxPointerLength &&
            10 < distance &&
            'end' === inputStatus &&
            'none' !== lastDirection &&
            'none' !== direction &&
            0.3 < lastVelocity;
    };
};