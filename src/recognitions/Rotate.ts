import Base from './Base';
import { Computed } from '../interface';

export default class RotateRecognizer extends Base {
    constructor(options:any){
        super(options);
    };

    recognize(computed: any, callback: (paylod: any) => {}) {
        if (this.test(computed)) {
            callback({ type: 'rotate', ...computed });

            //rotatestart |rotatemove |rotateend
            const type = this.getRecognizerStatus(computed.inputStatus);
            callback({ type: 'rotate' + type, ...computed });

        }
    };

    test({ length, inputStatus }: Computed) {
        // 如果触碰点要大于1
        // 如果已经识别, 并且当前事件是离开阶段
        return 1 < length || ('end' === inputStatus && this.isRecognized);
    };
};