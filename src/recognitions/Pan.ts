import { Computed, directionString } from '../interface';
import { INPUT_MOVE } from '../const';
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
    test({ distance, lastDirection, inputStatus, pointerLength }: Computed): boolean {
        // console.log({lastDirection});
        const isValidDirection = this.isVaildDirection(lastDirection);
        const isValidThreshold = this.options.threshold < distance;
        return this.isValidPointerLength(pointerLength) && isValidDirection &&
            (this.isRecognized || isValidThreshold) && INPUT_MOVE === inputStatus;
    };

    /**
     * 识别后发布panleft等事件
     * @param {Computed} 计算数据
     */
    afterEmit(computed: Computed) {
        // console.log({deltaX, deltaY});
        this.emit(this.options.name + computed.lastDirection, computed);
    };
    
    afterRecognized(computed: Computed){
        this.lockDirection(computed);
    }

    /**
     * 移除限制方向的deltaX/Y
     * @param {Computed} computed 
     */
    public lockDirection(computed: Computed): Computed {
        if (undefined === this.options.directions || 0 === this.options.directions.length) return computed;
        let deltaX = 0;
        let deltaY = 0;
        this.options.directions.forEach((direction: string) => {
            if ('left' === direction && 0 > computed.deltaX) {
                deltaX = computed.deltaX;
            } else if ('right' === direction && 0 < computed.deltaX) {
                deltaX = computed.deltaX;
            } else if ('down' === direction && 0 < computed.deltaY) {
                deltaY = computed.deltaY;
            } else if ('up' === direction && 0 > computed.deltaY) {
                deltaY = computed.deltaY;
                // console.log(321321312);
            }
        });
        computed.deltaX = deltaX;
        computed.deltaY = deltaY;
        return computed;
    };



    
};

// 默认参数
PanRecognizer.prototype.default = {
    name: 'pan',
    threshold: 10,
    pointerLength: 1,
    directions: ['up', 'right', 'down', 'left']
};