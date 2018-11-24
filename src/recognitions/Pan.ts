import { Computed, directionString } from '../interface';
import {INPUT_MOVE} from '../const';
import Recognizer from './Base';
import getHV from '../untils/getHV';
interface Options {
    name?: string;
    threshold?: number;
    pointerLength?: number;
    directions?: [directionString?, directionString?, directionString?, directionString?];
};

export default class PanRecognizer extends Recognizer {
    public name: string;
    public options: Options;

    constructor(options: Options={}) {
        super(options);
    };

    getTouchAction() {
        let touchActions = ['auto'];
        let { hasHorizontal, hasVertical } = getHV(this.options.directions);
        if (hasHorizontal && hasVertical) {
            touchActions = ['none'];
        } else if (!hasHorizontal && hasVertical) {
            // 没有水平移动
            touchActions = ['pan-x'];
        } else if (!hasVertical && hasHorizontal) {
            // 没有垂直移动
            touchActions = ['pan-y'];
        }
        return touchActions;
    };

    /**
     * @param {Computed} 计算数据
     * @return {Boolean}} .是否是当前手势 
     */
    test({ distance, direction, inputStatus, pointerLength }: Computed): boolean {
        const isValidDirection = -1 !== this.options.directions.indexOf(direction);
        const isValidThreshold = this.options.threshold < distance;
        return this.isValidPointerLength(pointerLength) && isValidDirection &&
            (this.isRecognized || isValidThreshold) && INPUT_MOVE === inputStatus;
    };

    /**
     * 识别后发布panleft等事件
     * @param {Computed} 计算数据
     */
    afterRecognized(computed: Computed) {
        this.emit(this.options.name + computed.direction, computed);
    }
};

// 默认参数
PanRecognizer.prototype.defaultOptions = {
    name: 'pan',
    threshold: 10,
    pointerLength: 1,
    directions: ['up', 'right', 'down', 'left']
};