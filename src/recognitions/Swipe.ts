import Recognizer from './Base';
import { Computed } from '../interface';
import { Options } from '../../types/recognition';
import {INPUT_END} from '../const';
export default class SwipeRecognizer extends Recognizer {
    constructor(options: Options={}) {
        super(options);
    };

    getTouchAction(){
        return ['none'];
    };

    /**
     * 识别后发布swipeleft等事件
     * @param {Computed} 计算数据
     */
    afterEmit(computed: Computed) {
        this.emit(this.options.name + computed.lastDirection, computed);
    };

    /**
     * 识别条件
     * @param {Computed} 计算数据
     */
    test(computed: Computed): boolean {
        const { inputStatus, lastDirection, direction, lastVelocityX, lastVelocityY, maxPointerLength, distance } = computed;
        // 如果只支持水平或垂直, 那么其他方向速率为0;
        // 有效速率
        let vaildVelocityX: number = lastVelocityX;
        let vaildVelocityY: number = lastVelocityY;
        if (this.isOnlyHorizontal()) {
            vaildVelocityY = 0;
        } else if (this.isOnlyVertical()) {
            vaildVelocityX = 0;
        }

        let vaildVelocity = Math.sqrt(vaildVelocityX * vaildVelocityX + vaildVelocityY * vaildVelocityY)

        return 1 === maxPointerLength &&
            this.options.threshold < distance &&
            INPUT_END === inputStatus &&
            this.isVaildDirection(lastDirection) &&
            this.options.velocity < vaildVelocity;
    };
};

// 默认参数
SwipeRecognizer.prototype.default = {
    name: 'swipe',
    threshold: 10,
    velocity: 0.3,
    pointerLength: 1,
    directions: ['up', 'right', 'down', 'left']
};