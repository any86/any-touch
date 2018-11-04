import { Computed } from '../interface';
import Base from './Base';
export default class PinchRecognizer extends Base {
    private _prevScale: number;
    constructor(options: any) {
        super(options);
    };

    recognize(computed: Computed) {
        if (this.test(computed)) {
            // console.log(computed);
            this.emit(this.name, computed);
            // pinchstart | pinchmove | pinchend
            const type = this.getRecognizerState(computed.inputStatus);
            this.emit(this.name + type, computed);
            // pinchin | pinchout
            const { scale } = computed;
            if (1 !== scale) {
                const inOrOut = scale > this._prevScale ? 'out' : 'in';
                if ('move' === type) {
                    this.emit(this.name + inOrOut, computed);
                    this._prevScale = scale;
                }
            }
        }
    };

    test({ pointerLength, inputStatus }: Computed) {
        // 如果触碰点要大于1
        // 如果已经识别, 并且当前事件是离开阶段
        return 1 < pointerLength || ('end' === inputStatus && this.isRecognized);
    };
};