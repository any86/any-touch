import { Computed, RecognizerCallback, nativeEventType } from '../interface';
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
        let eventnativeEventType: string;
        // if('end' == computed.nativeEventType) console.log(computed);

        // console.log(computed);

        if (this.test(computed)) {
            // panleft | panright | pandown | panup
            callback({ type: this.name + computed.direction, ...computed });

            // pan
            callback({ type: this.name, ...computed });

            // panstart | panmove | panend
            eventnativeEventType = this.recognizenativeEventType(computed.nativeEventType);
            callback({ type: this.name + eventnativeEventType, ...computed });
        }
    };

    /**
     * @param {Computed} 计算数据
     * @return {Boolean}} 是否是当前手势 
     */
    test({ maxLength, distance, nativeEventType }: Computed): Boolean {
        // console.log({ maxLength, distance, nativeEventType });
        return 'start' !== nativeEventType && this.threshold < distance && this.allowLength === maxLength;
    };
};