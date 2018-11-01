import Base from './Base';
import { Computed } from '../interface';

export default class RotateRecognizer extends Base {
    constructor(options: any) {
        super(options);
    };

    recognize(computed: any, callback: (paylod: any) => {}) {
        if (this.test(computed)) {
            callback({ ...computed, type: 'rotate', });

            //rotatestart |rotatemove |rotateend
            const type = this.getRecognizerState(computed.inputStatus);
            callback({ ...computed, type: 'rotate' + type });

        }
    };

    test({ pointerLength }: Computed) {
        // 如果触碰点要大于1
        // 如果已经识别, 并且当前事件是离开阶段
        return 1 < pointerLength || this.isRecognized;
    };
};