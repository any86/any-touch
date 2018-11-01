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
    public options: Options;
    constructor({
        name = 'pan',
        threshold = 10,
        pointerLength = 1,
        directions = ['up', 'right', 'down', 'left'] }: Options = {}) {
        super({ name });
        this.name = name;
        this.options = {
            threshold,
            pointerLength,
            directions
        };
    };

    /**
     * 识别器
     * @param {Computed} 计算数据 
     * @param {RecognizerCallback} 识别后触发钩子 
     */
    recognize(computed: Computed, callback: RecognizerCallback) {
        if (this.test(computed)) {
            // panleft | panright | pandown | panup
            callback({ ...computed, type: this.name + computed.direction });
            // pan
            callback({ ...computed, type: this.name });

            // panstart | panmove | panend
            let status = this.getRecognizerState(computed.inputStatus);
            callback({ ...computed, type: this.name + status });
        }
    };

    /**
     * @param {Computed} 计算数据
     * @return {Boolean}} .是否是当前手势 
     */
    test({ pointerLength, distance, direction}: Computed): Boolean {
        const isValidDirection = -1 !== this.options.directions.indexOf(direction);
        const isValidThreshold = this.options.threshold < distance;
        return isValidDirection && (this.isRecognized || isValidThreshold) && this.pointerLengthTest(pointerLength);
    };
};