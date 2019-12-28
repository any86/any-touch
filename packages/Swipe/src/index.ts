import { Input } from '@types';
import { INPUT_END, DIRECTION_ALL, NONE, DIRECTION_X, DIRECTION_Y } from '@const';
import ComputeDistance from '@any-touch/compute/ComputeDistance';
import ComputeVAndDir from '@any-touch/compute/ComputeVAndDir';
import ComputeMaxLength from '@any-touch/compute/ComputeMaxLength';
import recognizeForPressMoveLike from '@Recognizer/recognizeForPressMoveLike';
import isVaildDirection from '@Recognizer/isVaildDirection';
import Recognizer from '@any-touch/Recognizer';

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

    // /**
    //  * 识别后发布swipeleft等事件
    //  * @param {AnyTouchEvent} 计算数据
    //  */
    // afterEmit() {
    //     if (NONE !== this.event.direction) {
    //         this.emit(this.options.name + this.event.direction, this.event);
    //     }
    // };
    /**
     * 识别条件
     * @param {AnyTouchEvent} 计算数据
     */
    test(input: Input): boolean {
        const { inputType } = input;
        // 非end阶段, 开始校验数据
        if (INPUT_END !== inputType) return false;

        const { velocityX, velocityY, maxPointLength, distance, direction } = this.computed;
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
            isVaildDirection(this, direction) &&
            this.options.velocity < vaildVelocity;
    };
    /**
     * 开始识别
     * @param {Input} 输入 
     */
    recognize(input: Input, emit: (type: string, ...payload: any[]) => void) {
        type Computed = ReturnType<ComputeMaxLength['compute']> & ReturnType<ComputeVAndDir['compute']> &
            ReturnType<ComputeDistance['compute']>
        this.computed = <Computed>this.compute([ComputeMaxLength, ComputeVAndDir, ComputeDistance], input);
        recognizeForPressMoveLike(this, input, emit);
        // panleft...
        // emit(this.options.name + this.computed.direction, this.computed);
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



};