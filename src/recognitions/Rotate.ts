import Base from './Base';
import { Computed } from '../interface';
export default class RotateRecognizer extends Base {
    constructor(options: any) {
        super(options);
    };

    /**
     * 无特殊事件要触发
     */
    afterRecognized(computed: Computed) { };

    /**
     * 识别条件
     * @param {Computed} 计算数据
     * @return {Boolean} 接收是否识别状态
     */
    test({ pointerLength, angle }: Computed): boolean {
        // 如果触碰点数要大于指定
        // 如果缩放超过阈值, 或者已识别
        return this.isValidPointerLength(pointerLength) && (this.options.threshold < Math.abs(angle) || this.isRecognized);
    };
};

// 默认参数
RotateRecognizer.prototype.defaultOptions = {
    name: 'rotate',
    // 触发事件所需要的最小角度
    threshold: 0,
    pointerLength: 2,
};