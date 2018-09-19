import { Computed, RecognizerCallback } from '../interface';
interface Options {
    name?: string;
    threshold?: number;
    maxPointerLength?: number;
}

export default class PanRecognizer {
    public name: string;
    public threshold: number;
    public maxPointerLength: number;

    constructor({
        name = 'pan',
        threshold = 10,
        maxPointerLength = 1 }: Options = {}) {
        this.name = name;
        this.threshold = threshold;
        this.maxPointerLength = maxPointerLength;
    };

    /**
     * 识别器
     * @param {Computed} 计算数据 
     * @param {RecognizerCallback} 识别后触发钩子 
     */
    recognize(computed: Computed, callback: RecognizerCallback) {
        if (this.test(computed)) {
            callback({ type: this.name, ...computed });
            // panleft | panright | pandown | panup
            callback({ type: this.name + computed.direction, ...computed });
        }
    };

    /**
     * @param {Computed} 计算数据
     * @return {Boolean}} 是否是当前手势 
     */
    test({ length, distance, status }: Computed): Boolean {
        return 'move' === status && this.threshold < distance && this.maxPointerLength === length;
    };
};