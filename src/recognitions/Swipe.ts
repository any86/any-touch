import Recognizer from './Base';
import { Computed } from '../interface';
import { INPUT_END } from '../const';
export default class SwipeRecognizer extends Recognizer {
    static DEFAULT_OPTIONS = {
        name: 'swipe',
        threshold: 10,
        velocity: 0.3,
        pointerLength: 1,
        directions: ['up', 'right', 'down', 'left']
    };
    constructor(options = {}) {
        super(options);
    };

    getTouchAction() {
        return ['none'];
    };

    /**
     * 识别后发布swipeleft等事件
     * @param {Computed} 计算数据
     */
    afterEmit(computed: Computed) {
        if ('none' !== computed.direction) {
            this.emit(this.options.name + computed.direction, computed);
        }
    };

    /**
     * 识别条件
     * @param {Computed} 计算数据
     */
    test(computed: Computed): boolean {
        if (INPUT_END !== computed.eventType) return false;

        // 非end阶段, 开始校验数据
        const { direction, velocityX, velocityY, maxPointerLength, distance } = computed;
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

        return 1 === maxPointerLength &&
            this.options.threshold < distance &&
            this.isVaildDirection(direction) &&
            this.options.velocity < vaildVelocity;
    };
};