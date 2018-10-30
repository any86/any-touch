import { Computed, RecognizerCallback } from '../interface';
import {
    DIRECTION_NONE,
    DIRECTION_LEFT,
    DIRECTION_RIGHT,
    DIRECTION_UP,
    DIRECTION_DOWN,
    DIRECTION_HORIZONTAL,
    DIRECTION_VERTICAL,
    DIRECTION_ALL
} from '../const';
import Base from './Base';
interface Options {
<<<<<<< HEAD
    name?: string;
    threshold?: number;
    pointerLength?: number;
    direction?: number;
=======
    name: string;
    threshold: number;
    pointerLength: number;
    direction: number;
>>>>>>> 87f3025d70dbb239810eb636bbb50badd7280db7
};

export default class PanRecognizer extends Base {
    public name: string;
    public threshold: number;
    public pointerLength: number;
    public direction: number;

    constructor({
        name = 'pan',
        threshold = 10,
        pointerLength = 1,
        direction = DIRECTION_HORIZONTAL }: Options={}) {
        super({ name });
        this.name = name;
        this.threshold = threshold;
        this.pointerLength = pointerLength;
        this.direction = direction;
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
            type = this.recognizeType(computed.nativeEventType);
            callback({ type: this.name + type, ...computed });
        }
    };

    /**
     * @param {Computed} 计算数据
     * @return {Boolean}} 是否是当前手势 
     */
    test({ maxLength, distance, nativeEventType,direction }: Computed): Boolean {
        let isDirectVaild = false;
        if(DIRECTION_HORIZONTAL === this.direction && 'left' === direction )

        return isDirectVaild && 'start' !== nativeEventType && (this.isRecognized || this.threshold < distance) && this.pointerLength === maxLength;
    };
};