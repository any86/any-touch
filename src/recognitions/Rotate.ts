import Base from './Base';
import { Computed } from '../interface';

export default class RotateRecognizer extends Base {
    constructor(options: any) {
        super(options);
    };

    recognize(computed: Computed):void {
        if (this.test(computed)) {
            this.emit(this.name, computed);

            //rotatestart |rotatemove |rotateend
            const type = this.getRecognizerState(computed.inputStatus);
            this.emit(this.name + type, computed);
        }
    };

    test({ pointerLength }: Computed) {
        // 如果触碰点要大于1
        // 如果已经识别, 并且当前事件是离开阶段
        return 1 < pointerLength || this.isRecognized;
    };
};