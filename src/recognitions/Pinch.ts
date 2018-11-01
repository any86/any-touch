import { Computed } from '../interface';
import Base from './Base';
export default class PinchRecognizer extends Base {
    private _prevScale: number;
    constructor(options: any) {
        super(options);
    };

    recognize(computed: Computed, callback: (anyTouchEvent: any) => void) {
        if (this.test(computed)) {
            // console.log(computed);
            callback({ ...computed, type: 'pinch' });

            // pinchstart | pinchmove | pinchend
            const type = this.getRecognizerState(computed.inputStatus);
            callback({ ...computed, type: 'pinch' + type });

            // pinchin | pinchout
            const { scale } = computed;
            if (1 !== scale) {
                const inOrOut = scale > this._prevScale ? 'out' : 'in';
                if ('move' === type) {
                    callback({ ...computed, type: 'pinch' + inOrOut });
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