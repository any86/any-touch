import { Computed } from '../interface';
import Recognizer from './Base';
export default class PinchRecognizer extends Recognizer {
    private _prevScale: number;
    constructor(options: any) {
        super(options);
        this._prevScale = 1;
    };
    
    getTouchAction(){
        return 'none';
    };

    afterRecognized(computed: Computed) {
        // pinchin | pinchout
        const { scale } = computed;
        if (1 !== scale) {
            const inOrOut = scale > this._prevScale ? 'out' : 'in';
            this.emit(this.options.name + inOrOut, computed);
        }
        this._prevScale = scale;
    };

    /**
     * 识别条件
     * @param {Computed} 计算数据
     * @param {(isRecognized: boolean) => void}} 接收是否识别状态
     */
    test({ pointerLength, scale }: Computed): boolean {
        // 如果触碰点数要大于指定
        // 如果缩放超过阈值, 或者已识别
        return this.isValidPointerLength(pointerLength) && (this.options.threshold < Math.abs(scale - 1) || this.isRecognized);
    };
};

// 默认参数
PinchRecognizer.prototype.defaultOptions = {
    name: 'pinch',
    // 触发事件所需要的最小缩放比例
    threshold: 0,
    pointerLength: 2,
};