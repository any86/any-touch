import Base from './Base';
import { Computed } from '../interface';

export default class RotateRecognizer extends Base {
    constructor(options: any) {
        super(options);
    };

    afterRecognized(computed: Computed) {
        //rotatestart |rotatemove |rotateend
        this.emit(this.name + this.status, computed);
    };

    /**
     * 识别条件
     * @param {Computed} 计算数据
     * @param {(isRecognized: boolean) => void}} 接收是否识别状态
     */    
    test({ pointerLength }: Computed, callback: (isRecognized: boolean) => void) {
        // 如果触碰点要大于1
        // 如果已经识别, 并且当前事件是离开阶段
        callback(1 < pointerLength || this.isRecognized);
    };
};