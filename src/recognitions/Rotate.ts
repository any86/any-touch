import Base from './Base';
import { Computed } from '../interface';

export default class RotateRecognizer extends Base {
    constructor(options: any) {
        super(options);
    };

    afterRecognized(computed: Computed) {
        //rotatestart |rotatemove |rotateend
        this.emit(this.options.name + this.status, computed);
    };

    /**
     * 识别条件
     * @param {Computed} 计算数据
     * @return {Boolean} 接收是否识别状态
     */
    test({ pointerLength }: Computed): boolean {
        // 如果触碰点要大于1
        return 1 < pointerLength;
    };
};