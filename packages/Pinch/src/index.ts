import { Input, CommonEmitFunction } from '@types';
import { NONE, INPUT_END } from '@const';
import ComputeVectorForMutli from '@any-touch/compute/ComputeVectorForMutli';
import computeScale from '@any-touch/compute/computeScale';
import recognizeForPressMoveLike from '@Recognizer/recognizeForPressMoveLike';
import Recognizer from '@Recognizer/index';

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

    // afterEmit() {
    //     if (INPUT_END === this.event.eventType) return;
    //     // pinchin | pinchout
    //     const { scale, deltaScale } = this.event;
    //     if (1 !== scale) {
    //         const inOrOut = scale > this._prevScale ? 'out' : 'in';
    //         this.emit(this.options.name + inOrOut, this.event);
    //     }
    //     this._prevScale = scale;
    //     this._prevDeltaScale = deltaScale;
    // };

    /**
     * 识别条件
     * @param {AnyTouchEvent} 计算数据
     * @param {(isRecognized: boolean) => void}} 接收是否识别状态
     */
    test(input: Input): boolean {
        const { pointLength } = input;
        const { scale } = this.computed;
        return this.isValidPointLength(pointLength) && (this.options.threshold < Math.abs(scale - 1) || this.isRecognized);
    };

    /**
     * 开始识别
     * @param {Input} 输入 
     */
    recognize(input: Input, emit: CommonEmitFunction) {
        type Computed = ReturnType<ComputeVectorForMutli['compute']> & {};
        const computed = <Computed>this.compute([ComputeVectorForMutli], input);
        if (`activeV` in computed) {
            // const {activeV, prevV,startV} = computed;
            this.computed = {...this.computed, ...computeScale(computed)};
        }
        // console.log(this.computed);
        recognizeForPressMoveLike(this, input, emit);
    };
};