import { AnyTouchEvent, InputRecord } from '@/types';
import {NONE,INPUT_END} from '@/const';
import Recognizer from './Base';
import computMulti from '@/compute/computeMulti';

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
        return [NONE];
    };

    afterEmit() {
        if(INPUT_END === this.event.eventType) return;
        // pinchin | pinchout
        const { scale } = this.event;
        if (1 !== scale) {
            const inOrOut = scale > this._prevScale ? 'out' : 'in';
            this.emit(this.options.name + inOrOut, this.event);
        }
        this._prevScale = scale;
    };

    /**
     * 识别条件
     * @param {AnyTouchEvent} 计算数据
     * @param {(isRecognized: boolean) => void}} 接收是否识别状态
     */
    test(inputRecord:InputRecord): boolean {
        const {input} = inputRecord;
        const {pointLength} = input;
   
        const computed = this.event['scale'] ? this.event[`scale`] : computMulti(inputRecord, <any>this.$store);
        const {scale,deltaScale} = computed;
        this.event = {...this.event, scale,deltaScale};
        // { pointLength, scale }: AnyTouchEvent
        // 如果触碰点数要大于指定
        // 如果缩放超过阈值, 或者已识别
        // console.log({scale})
        return this.isValidPointLength(pointLength) && (this.options.threshold < Math.abs(scale-1) || this.isRecognized);
    };
};