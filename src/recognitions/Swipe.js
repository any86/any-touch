import {
    getDirection
} from '../vector'
export default class SwipeRecognizer {

    constructor() {
        this.type = 'swipe';
        this.$fingerInput = {};
        this.direction = '';
        // this.swipeTimeout = null;
    };

    // start(fingerInput) {

    // };

    // move(fingerInput) {

    // };

    end(fingerInput) {
        const {
            offsetX,
            offsetY,
            offsetTime,
            absVelocityX,
            absVelocityY
        } = fingerInput;
        if (250 > offsetTime && (0.3 < absVelocityX || 0.3 < absVelocityY)) {
            // 同步数据
            this.$fingerInput = fingerInput;
            // 滑动方向
            this.direction = getDirection(offsetX, offsetY);
            this.type = `swipe${this.direction}`;
            return this.type;
        }
    };

    // cancel() {

    // };

    computedData() {
        const {
            deltaX,
            deltaY,
            velocityX,
            velocityY
        } = this.$fingerInput;
        return {
            type: this.type,
            belong: 'swipe',
            deltaX: Math.round(deltaX),
            deltaY: Math.round(deltaY),
            velocityX: Math.round(velocityX),
            velocityY: Math.round(velocityY),
            nativeEvent: this.$fingerInput.nativeEvent,
            direction: this.direction
        }
    }
};