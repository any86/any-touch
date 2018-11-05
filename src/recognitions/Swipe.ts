import Recognizer from './Base';
import { Computed } from '../interface';
export default class SwipeRecognizer extends Recognizer {
    public name: string;

    constructor(options: any) {
        super(options);
        this.name = 'swipe'
    };

    afterRecognized(computed: Computed): void {
        this.emit(this.name + computed.lastDirection, computed);
    };
    
    /**
     * 识别条件
     * @param {Computed} 计算数据
     * @param {(isRecognized: boolean) => void}} 接收是否识别状态
     */
    test(computed: Computed,callback: (isRecognized: boolean) => void) {
        const { inputStatus, lastDirection, direction, lastVelocity, maxPointerLength, distance } = computed;
        callback(1 === maxPointerLength &&
            10 < distance &&
            'end' === inputStatus &&
            'none' !== lastDirection &&
            'none' !== direction &&
            0.3 < lastVelocity);
    };
};