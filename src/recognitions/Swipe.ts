import Recognizer from './Base';
import { AnyTouchEvent } from '@/types';
import { INPUT_END,DIRECTION_ALL,NONE } from '../const';
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
    afterEmit(computed: AnyTouchEvent) {
        if (NONE !== computed.direction) {
            this.emit(this.options.name + computed.direction, computed);
        }
    };

    /**
     * 识别条件
     * @param {AnyTouchEvent} 计算数据
     */
    test(computed: AnyTouchEvent): boolean {
        if (INPUT_END !== computed.eventType) return false;

        // 非end阶段, 开始校验数据
        const { direction, velocityX, velocityY, maxPointLength, distance } = computed;
        // 如果只支持水平或垂直, 那么其他方向速率为0;
        // 有效速率
        let vaildVelocityX: number = velocityX;
        let vaildVelocityY: number = velocityY;
        if (this.isOnlyHorizontal()) {
            vaildVelocityY = 0;
        } else if (this.isOnlyVertical()) {
            vaildVelocityX = 0;
        }

        let vaildVelocity = Math.sqrt(vaildVelocityX * vaildVelocityX + vaildVelocityY * vaildVelocityY)

        return 1 === maxPointLength &&
            this.options.threshold < distance &&
            this.isVaildDirection(direction) &&
            this.options.velocity < vaildVelocity;
    };
};