import { AnyTouchEvent, Computed, Input } from '@types';
import { INPUT_MOVE, PAN_Y, PAN_X, DIRECTION_LEFT, DIRECTION_RIGHT, DIRECTION_DOWN, DIRECTION_UP, DIRECTION_ALL, NONE, AUTO } from '@const';
import Recognizer from '@any-touch/Recognizer';
import getHV from '@shared/getHV';
import ComputeDistance from '@compute/ComputeDistance';
import ComputeDeltaXY from '@compute/ComputeDeltaXY';
import ComputeVAndDir from '@compute/ComputeVAndDir';
import recognizeForPressMoveLike from '@Recognizer/recognizeForPressMoveLike';
import isVaildDirection from '@Recognizer/isVaildDirection';


export default class PanRecognizer extends Recognizer {
    static DEFAULT_OPTIONS = {
        name: 'pan',
        threshold: 10,
        pointLength: 1,
        directions: DIRECTION_ALL
    };

    constructor(options = {}) {
        super(options);
    };

    getTouchAction() {
        let touchActions = [AUTO];
        let { hasHorizontal, hasVertical } = getHV(this.options.directions);
        // console.log(this.options.directions, hasHorizontal, hasVertical);
        if (hasHorizontal && hasVertical) {
            touchActions = [NONE];
        } else if (!hasHorizontal && hasVertical) {
            // 没有水平移动
            touchActions = [PAN_X];
        } else if (!hasVertical && hasHorizontal) {
            // 没有垂直移动
            touchActions = [PAN_Y];
        }
        return touchActions;
    };

    /**
     * @param {AnyTouchEvent} 计算数据
     * @return {Boolean}} .是否是当前手势 
     */
    test(input: Input): boolean {
        const { inputType, pointLength } = input;

        type Computed = ReturnType<ComputeVAndDir['compute']> & ReturnType<ComputeDistance['compute']> &
            ReturnType<ComputeDeltaXY['compute']>

        const computed = <Computed>this.compute([ComputeVAndDir, ComputeDistance, ComputeDeltaXY], input);
        const { direction, distance } = computed;
        return INPUT_MOVE === inputType &&
            (this.isRecognized || this.options.threshold < distance) &&
            this.isValidPointLength(pointLength) &&
            isVaildDirection(this, direction);
    };

    /**
     * 开始识别
     * @param {Input} 输入 
     */
    recognize(input: Input, callback: (type: string, ...payload: any[]) => void) {
        recognizeForPressMoveLike(this, input, callback);
    };

    /**
     * 识别后发布panleft等事件
     * @param {AnyTouchEvent} 计算数据
     */
    afterEmit() {
        if (NONE !== this.event.direction) {
            this.emit(this.options.name + this.event.direction, this.event);
        }
    };

    afterRecognized(computed: AnyTouchEvent) {
        // this.lockDirection(computed);
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
            if (DIRECTION_LEFT === direction && 0 > computed.deltaX) {
                deltaX = computed.deltaX;
            } else if (DIRECTION_RIGHT === direction && 0 < computed.deltaX) {
                deltaX = computed.deltaX;
            } else if (DIRECTION_DOWN === direction && 0 < computed.deltaY) {
                deltaY = computed.deltaY;
            } else if (DIRECTION_UP === direction && 0 > computed.deltaY) {
                deltaY = computed.deltaY;
            }
        });
        computed.deltaX = deltaX;
        computed.deltaY = deltaY;
        return computed;
    };
};