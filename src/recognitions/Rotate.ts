import Base from './Base';
import { Computed } from '../interface';
import { STATUS_START } from '../const/recognizerStatus';
export default class RotateRecognizer extends Base {
    constructor(options: any) {
        super(options);
    };

    /**
     * 无特殊事件要触发
     */
    afterRecognized(computed: Computed) {};

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