import { AnyTouchEvent } from '../interface';
import Recognizer from './Base';


export default class PinchRecognizer extends Recognizer {
    private _prevScale: number;
    static DEFAULT_OPTIONS = {
        name: 'pinch',
        // 触发事件所需要的最小缩放比例
        threshold: 0,
        pointLength: 2,
    };
    constructor(options={}) {
        super(options);
        this._prevScale = 1;
    };
    
    getTouchAction(){
        return ['none'];
    };

    afterEmit(computed: AnyTouchEvent) {
        if('end' === computed.eventType) return;
        // pinchin | pinchout
        const { scale } = computed;
        if (1 !== scale) {
            const inOrOut = scale > this._prevScale ? 'out' : 'in';
            this.emit(this.options.name + inOrOut, computed);
        }
        this._prevScale = scale;
    };

    /**
     * 识别条件
     * @param {AnyTouchEvent} 计算数据
     * @param {(isRecognized: boolean) => void}} 接收是否识别状态
     */
    test({ pointLength, scale }: AnyTouchEvent): boolean {
        // 如果触碰点数要大于指定
        // 如果缩放超过阈值, 或者已识别
        // console.log({scale})
        return this.isValidPointLength(pointLength) && (this.options.threshold < Math.abs(scale-1) || this.isRecognized);
    };
};