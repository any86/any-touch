import Recognizer from './Base';
import { Computed } from '../interface';
export default class SwipeRecognizer extends Recognizer {
    constructor(options: any = {pointerLength:1}) {
        super(options);
    };

    afterRecognized(computed: Computed): void {
        this.emit(this.options.name + computed.lastDirection, computed);
    };
    
    /**
     * 识别条件
     * @param {Computed} 计算数据
     */
    test(computed: Computed):boolean {
        const { inputStatus, lastDirection, direction, lastVelocity, maxPointerLength, distance } = computed;
        return 1 === maxPointerLength &&
            10 < distance &&
            'end' === inputStatus &&
            'none' !== lastDirection &&
            'none' !== direction &&
            0.3 < lastVelocity;
    };
};