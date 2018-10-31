import { Computed, RecognizerCallback, directionString } from '../interface';
import Base from './Base';
interface Options {
    name?: string;
    threshold?: number;
    pointerLength?: number;
    directions?: directionString[];
};

export default class PanRecognizer extends Base {
    public name: string;
    public threshold: number;
    public pointerLength: number;
    public directions: directionString[];
    constructor({
        name = 'pan',
        threshold = 10,
        pointerLength = 1,
        directions = ['up', 'right', 'down', 'left'] }: Options = {}) {
        super({ name });
        this.name = name;
        this.threshold = threshold;
        this.pointerLength = pointerLength;
        this.directions = directions;
    };

    /**
     * 识别器
     * @param {Computed} 计算数据 
     * @param {RecognizerCallback} 识别后触发钩子 
     */
    recognize(computed: Computed, callback: RecognizerCallback) {
        let type: string;
        if (this.test(computed)) {
            // panleft | panright | pandown | panup
            callback({ type: this.name + computed.direction, ...computed });
            // pan
            callback({ type: this.name, ...computed });
            // panstart | panmove | panend
            type = this.getRecognizerStatus(computed.inputStatus);
            callback({ type: this.name + type, ...computed });
        }
    };

    /**
     * @param {Computed} 计算数据
     * @return {Boolean}} 是否是当前手势 
     */
    test({ maxLength, distance, inputStatus, direction }: Computed): Boolean {
        const isValidDirectionVaild = -1 !== this.directions.indexOf(direction);
        const isValidType = 'start' !== inputStatus;
        return isValidDirectionVaild && isValidType && (this.isRecognized || this.threshold < distance) && this.pointerLength === maxLength;
    };
};