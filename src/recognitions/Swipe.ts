import Recognizer from './Base';
import { InputRecord } from '@/types';
import { INPUT_END, DIRECTION_ALL, NONE, KEY_DIRECTION, KEY_DISTANCE, KEY_MAX_POINT_LENGTH } from '@/const';
import computeDistance from '@/compute/computeDistance';
import intervalCompute from '@/compute/intervalCompute';
import computeMaxLength from '@/compute/computeMaxLength';


export default class SwipeRecognizer extends Recognizer {
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
     * 识别条件
     * @param {AnyTouchEvent} 计算数据
     */
    test(inputRecord: InputRecord): boolean {
        const { input } = inputRecord;
        const { eventType } = input;

        // 非end阶段, 开始校验数据
        // maxPointLength
        const maxPointLength = this._cacheComputed(computeMaxLength, inputRecord, <any>this.$store);

        // velocityX, velocityY, speedX, speedY, direction
        const intervalComputeData = this._cacheComputed(intervalCompute, inputRecord, <any>this.$store);
        const { velocityX, velocityY, direction } = intervalComputeData;

        // displacementX, displacementY, distanceX, distanceY, distance, overallDirection
        const computeDistanceData = this._cacheComputed(computeDistance, inputRecord, <any>this.$store);
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
            this.isVaildDirection(direction) &&
            this.options.velocity < vaildVelocity;
    };
};