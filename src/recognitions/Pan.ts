import { AnyTouchEvent, Computed } from '../interface';
import { INPUT_MOVE } from '../const';
import Recognizer from './Base';
import getHV from '../utils/getHV';

export default class PanRecognizer extends Recognizer {
    static DEFAULT_OPTIONS = {
        name: 'pan',
        threshold: 10,
        pointLength: 1,
        directions: ['up', 'right', 'down', 'left']
    };
    constructor(options = {}) {
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
     * @param {AnyTouchEvent} 计算数据
     * @return {Boolean}} .是否是当前手势 
     */
    test({ distance, direction, eventType, pointLength }: AnyTouchEvent): boolean {
        return INPUT_MOVE === eventType &&
            (this.isRecognized || this.options.threshold < distance) &&
            this.isValidPointLength(pointLength) &&
            this.isVaildDirection(direction);
    };

    /**
     * 识别后发布panleft等事件
     * @param {AnyTouchEvent} 计算数据
     */
    afterEmit(computed: AnyTouchEvent) {
        if ('none' !== computed.direction) {
            this.emit(this.options.name + computed.direction, computed);
        }
    };

    afterRecognized(computed: AnyTouchEvent) {
        this.lockDirection(computed);
    }

    /**
     * 移除限制方向的deltaX/Y
     * @param {AnyTouchEvent} computed 
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
            }
        });
        computed.deltaX = deltaX;
        computed.deltaY = deltaY;
        return computed;
    };
};