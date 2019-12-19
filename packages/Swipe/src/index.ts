import RecognizerWithRequireFailure from './RecognizerWithRequireFailure';
import { InputRecord } from '@any-touch/types';
import { INPUT_END, DIRECTION_ALL, NONE, DIRECTION_X, DIRECTION_Y } from '@any-touch/const';
import computeDistance from '@any-touch/compute/computeDistance';
import intervalCompute from '@any-touch/compute/intervalCompute';
import computeMaxLength from '@any-touch/compute/computeMaxLength';
import recognizeForPressMoveLike from './recognizeForPressMoveLike';
import isVaildDirection from './isVaildDirection';

export default class SwipeRecognizer extends RecognizerWithRequireFailure {
    static DEFAULT_OPTIONS = {
        name: 'swipe',
        threshold: 10,
        velocity: 0.3,
        pointLength: 1,
        directions: DIRECTION_ALL
    };
    constructor(options = {}) {
        super(options);
    };

    getTouchAction() {
        return [NONE];
    };

    /**
     * 识别后发布swipeleft等事件
     * @param {AnyTouchEvent} 计算数据
     */
    afterEmit() {
        if (NONE !== this.event.direction) {
            this.emit(this.options.name + this.event.direction, this.event);
        }
    };

    /**
     * 开始识别
     * @param {InputRecord} 输入 
     */
    recognize(inputRecord:InputRecord){
        recognizeForPressMoveLike(this,inputRecord);
    };
    /**
     * 是否只支持水平方向
     */
    isOnlyHorizontal() {
        let isOnlyHorizontal = true;
        for (let direction of this.options.directions) {
            isOnlyHorizontal = -1 < DIRECTION_X.indexOf(direction);
            if (!isOnlyHorizontal) {
                return false;
            }
        }
        return isOnlyHorizontal;
    };
    /**
     * 是否只支持垂直方向
     */
    isOnlyVertical() {
        let isOnlyVertical = true;
        for (let direction of this.options.directions) {
            isOnlyVertical = -1 < DIRECTION_Y.indexOf(direction);
            if (!isOnlyVertical) {
                return false;
            }
        }
        return isOnlyVertical;
    };


    /**
     * 识别条件
     * @param {AnyTouchEvent} 计算数据
     */
    test(inputRecord: InputRecord): boolean {
        const { input } = inputRecord;
        const { eventType } = input;

        // 非end阶段, 开始校验数据
        // maxPointLength
        const maxPointLength = this._getComputed(computeMaxLength, inputRecord, <any>this.$store);

        // velocityX, velocityY, speedX, speedY, direction
        const intervalComputeData = this._getComputed(intervalCompute, inputRecord, <any>this.$store);
        const { velocityX, velocityY, direction } = intervalComputeData;

        // displacementX, displacementY, distanceX, distanceY, distance, overallDirection
        const computeDistanceData = this._getComputed(computeDistance, inputRecord, <any>this.$store);
        const { distance } = computeDistanceData;

        if (INPUT_END !== eventType) return false;

        this.event = { ...this.event, maxPointLength, ...intervalComputeData, ...computeDistanceData };

        // 如果只支持水平或垂直, 那么其他方向速率为0;
        // 有效速率
        let vaildVelocityX: number = velocityX;
        let vaildVelocityY: number = velocityY;
        if (this.isOnlyHorizontal()) {
            vaildVelocityY = 0;
        } else if (this.isOnlyVertical()) {
            vaildVelocityX = 0;
        }

        const vaildVelocity = Math.sqrt(vaildVelocityX * vaildVelocityX + vaildVelocityY * vaildVelocityY)


        return this.options.pointLength === maxPointLength &&
            this.options.threshold < distance &&
            isVaildDirection(this,direction) &&
            this.options.velocity < vaildVelocity;
    };
};