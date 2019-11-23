import Base from './Base';
import {NONE} from '../const';
import { AnyTouchEvent } from '@/types';
export default class RotateRecognizer extends Base {
    static DEFAULT_OPTIONS = {
        name: 'rotate',
        // 触发事件所需要的最小角度
        threshold: 0,
        pointLength: 2,
    };
    constructor(options = {}) {
        super(options);
    };

    getTouchAction() {
        return [NONE];
    };

    /**
     * 无特殊事件要触发
     */
    afterEmit(computed: AnyTouchEvent) { };

    /**
     * 识别条件
     * @param {AnyTouchEvent} 计算数据
     * @return {Boolean} 接收是否识别状态
     */
    test({ pointLength, angle }: AnyTouchEvent): boolean {
        // 如果触碰点数要大于指定
        // 如果缩放超过阈值, 或者已识别
        return this.isValidPointLength(pointLength) && (this.options.threshold < Math.abs(angle) || this.isRecognized);
    };
};