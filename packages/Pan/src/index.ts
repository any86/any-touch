import { AnyTouchEvent, Computed, InputRecord } from '@types';
import { INPUT_MOVE, PAN_Y, PAN_X, DIRECTION_LEFT, DIRECTION_RIGHT, DIRECTION_DOWN, DIRECTION_UP, DIRECTION_ALL, NONE, AUTO, KEY_DELTAX, KEY_DIRECTION, KEY_DISTANCE } from '../const';
import Recognizer from '@any-touch/Recognizer';
import getHV from '@shared/getHV';
import computeDistance from '@compute/computeDistance';
import computeDeltaXY from '@compute/computeDeltaXY';
import intervalCompute from '@compute/intervalCompute';
import recognizeForPressMoveLike from '@any-touch/Recognizer/recognizeForPressMoveLike';
import isVaildDirection from '@any-touch/Recognizer/isVaildDirection';


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
    test(inputRecord: InputRecord): boolean {
        const { input } = inputRecord;
        const { eventType, pointLength } = input;
        // velocityX, velocityY, speedX, speedY, direction
        const intervalComputeData = this._getComputed(intervalCompute, inputRecord, <any>this.$store);

        // displacementX, displacementY, distanceX, distanceY, distance, overallDirection
        const computeDistanceData = this._getComputed(computeDistance, inputRecord, <any>this.$store);

        //  deltaX, deltaY, deltaXYAngle
        const deltaXYComputed = this._getComputed(computeDeltaXY, inputRecord, <any>this.$store);

        const { direction } = intervalComputeData;
        const { distance } = computeDistanceData;

        // 赋值event
        this.event = { ...this.event, ...intervalComputeData, ...computeDistanceData, ...deltaXYComputed };

        return INPUT_MOVE === eventType &&
            (this.isRecognized || this.options.threshold < distance) &&
            this.isValidPointLength(pointLength) &&
            isVaildDirection(this, direction);
    };

    /**
     * 开始识别
     * @param {InputRecord} 输入 
     */
    recognize(inputRecord: InputRecord) {
        recognizeForPressMoveLike(this, inputRecord);
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