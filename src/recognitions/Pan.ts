import { Computed, directionString } from '../interface';
import Recognizer from './Base';
interface Options {
    name?: string;
    threshold?: number;
    pointerLength?: number;
    directions?: directionString[];
};

export default class PanRecognizer extends Recognizer {
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
     * 识别条件
     * @param {Computed} 计算数据
     * @param {(isRecognized: boolean) => void}} 接收是否识别状态
     */
    test({ pointerLength, distance, direction, inputStatus }: Computed, callback: (isRecognized: boolean) => void) {
        const isValidDirection = -1 !== this.options.directions.indexOf(direction);
        const isValidThreshold = this.options.threshold < distance;
        const isEnd = ('end' === inputStatus && this.isRecognized);
        callback(isValidDirection &&
            (this.isRecognized || isValidThreshold) &&
            this.pointerLengthTest(pointerLength) || isEnd);
    };

    /**
     * 识别后执行
     * @param {Computed} 计算数据 
     */
    afterRecognized(computed: Computed) {
        // panleft | panright | pandown | panup
        this.emit(this.name + computed.direction, computed);
        // panstart | panmove | panend
        this.emit(this.name + this.status, computed);
    };
};