import { Computed, RecognizerCallback, status } from '../interface';
import Base from './Base';
interface Options {
    name?: string;
    threshold?: number;
    allowLength?: number;
}

export default class PanRecognizer extends Base {
    public name: string;
    public threshold: number;
    public allowLength: number;

    constructor({
        name = 'pan',
        threshold = 10,
        allowLength = 1 }: Options = {}) {
        super();
        this.name = name;
        this.threshold = threshold;
        this.allowLength = allowLength;
    };

    /**
     * 识别器
     * @param {Computed} 计算数据 
     * @param {RecognizerCallback} 识别后触发钩子 
     */
    recognize(computed: Computed, callback: RecognizerCallback) {
        let eventStatus: string;
        if (this.test(computed)) {
            callback({ type: this.name, ...computed });
            // panleft | panright | pandown | panup
            // callback({ type: this.name + computed.direction, ...computed });

            // panstart | panmove | panend
            // eventStatus = this.recognizeStatus(computed.status);
            // callback({ type: this.name + eventStatus, ...computed });
        }
    };

    /**
     * @param {Computed} 计算数据
     * @return {Boolean}} 是否是当前手势 
     */
    test({ length, distance, status }: Computed): Boolean {
        return 'start' !== status && this.threshold < distance && this.allowLength === length;
    };
};