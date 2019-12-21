import { AnyTouchEvent, InputRecord } from '@types';
import { NONE, INPUT_END } from '@const';
import computeVectorForMutli from '@compute/computeVectorForMutli';
import computeScale from '@compute/computeScale';
import recognizeForPressMoveLike from '@Recognizer/recognizeForPressMoveLike';
import Recognizer from '@Recognizer/Base';


export default class PinchRecognizer extends Recognizer {
    private _prevScale: number;
    private _prevDeltaScale: number;
    static DEFAULT_OPTIONS = {
        name: 'pinch',
        // 触发事件所需要的最小缩放比例
        threshold: 0,
        pointLength: 2,
    };
    constructor(options = {}) {
        super(options);
        this._prevScale = 1;
        this._prevDeltaScale = 1;
    };

    getTouchAction() {
        return [NONE];
    };

    afterEmit() {
        if (INPUT_END === this.event.eventType) return;
        // pinchin | pinchout
        const { scale, deltaScale } = this.event;
        if (1 !== scale) {
            const inOrOut = scale > this._prevScale ? 'out' : 'in';
            this.emit(this.options.name + inOrOut, this.event);
        }
        this._prevScale = scale;
        this._prevDeltaScale = deltaScale;
    };

    /**
     * 识别条件
     * @param {AnyTouchEvent} 计算数据
     * @param {(isRecognized: boolean) => void}} 接收是否识别状态
     */
    test(inputRecord: InputRecord): boolean {
        const { input } = inputRecord;
        const { pointLength } = input;
        const vectors = this._getComputed(computeVectorForMutli,inputRecord);
        if (void 0 === vectors) {
            const scale = this._prevScale;
            const deltaScale = this._prevDeltaScale;
            this.event = { ...this.event, scale, deltaScale };
            return false;
        } else {
            const { scale, deltaScale } = this._getComputed(computeScale, vectors);
            this.event = { ...this.event, scale, deltaScale };
            return this.isValidPointLength(pointLength) && (this.options.threshold < Math.abs(scale - 1) || this.isRecognized);
        }
    };

        /**
     * 开始识别
     * @param {InputRecord} 输入 
     */
    recognize(inputRecord:InputRecord){
        recognizeForPressMoveLike(this,inputRecord);
    };
};