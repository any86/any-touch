import Recognizer from './Base';
import { Computed } from '../interface';
import { DIRECTION_UP, DIRECTION_RIGHT, DIRECTION_DOWN, DIRECTION_LEFT } from '../const/directions';
export default class SwipeRecognizer extends Recognizer {
    constructor(options: any = { pointerLength: 1 }) {
        super(options);
    };

    afterRecognized(computed: Computed): void {
        this.emit(this.options.name + computed.lastDirection, computed);
    };


    /**
     * 识别条件
     * @param {Computed} 计算数据
     */
    test(computed: Computed): boolean {
        const { inputStatus, lastDirection, direction, lastVelocity, lastVelocityX, lastVelocityY, maxPointerLength, distance } = computed;
        let vaildVelocity: number = lastVelocity;

        const DIRECTION_MAP = {
            'up': 1,
            'right': 2,
            'down': 3,
            'left': 4
        };

        // lastDirection是最近25ms内位移方向
        if (this.isValidDirection('up') || this.isValidDirection('down')) {
            vaildVelocity = lastVelocityY;
        } else if (this.isValidDirection('right') || this.isValidDirection('left')) {
            vaildVelocity = lastVelocityX;
        }
        console.log(vaildVelocity);

        return 1 === maxPointerLength &&
            this.options.threshold < distance &&
            'end' === inputStatus &&
            'none' !== lastDirection &&
            'none' !== direction &&
            this.options.velocity < Math.abs(vaildVelocity);
    };
};

// 默认参数
SwipeRecognizer.prototype.defaultOptions = {
    name: 'swipe',
    threshold: 10,
    velocity: 0.3,
    pointerLength: 1,
    directions: ['up', 'right', 'down', 'left']
};