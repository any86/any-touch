import {
    getCenter
} from '../vector'
export default class PinchRecognizer {

    constructor() {
        this.type = 'pinchend';
        this.$fingerInput = {};
        this.scale = 1;
        // this.pinchTimeout = null;
    };

    // start(fingerInput) {

    // };

    move(fingerInput) {
        this.$fingerInput = fingerInput;
        this.type = 'pinchend' === this.type ? 'pinchstart' : 'pinchmove';
        return this.type;
    };

    end(fingerInput) {
        this.$fingerInput = fingerInput;
        if ('pinchend' !== this.type)
            this.type = 'pinchend';
        return this.type;
    };

    // cancel() {

    // };

    computedData() {
        if ('pinchend' === this.type) return {
            type: this.type,
            belong: 'pinch',
            nativeEvent: this.$fingerInput.nativeEvent
        };
        else {
            const {
                x,
                y
            } = getCenter(this.$fingerInput.points);
            return {
                type: this.type,
                belong: 'pinch',
                scale: Math.round(this.$fingerInput.vModule / this.$fingerInput.prevVModule*100)/100,
                centerX: Math.round(x),
                centerY: Math.round(y),
                nativeEvent: this.$fingerInput.nativeEvent,
            }
        }
    }
};