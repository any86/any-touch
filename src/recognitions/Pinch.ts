import { Computed } from '../interface';
import Recognizer from './Base';
export default class PinchRecognizer extends Recognizer {
    private _prevScale: number;
    constructor(options: any) {
        super(options);
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
    test({ pointerLength, inputStatus }: Computed): boolean {
        // 如果触碰点要大于1
        // 如果已经识别, 并且当前事件是离开阶段
        return 1 < pointerLength;
    };
};