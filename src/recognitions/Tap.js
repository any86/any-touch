export default class TapRecognizer {
    constructor() {
        this.type = 'tap';
        this.$fingerInput = {};
        this.tapTimeout = null;
        this.tapCount = 0;
    };

    // start(fingerInput) {

    // };

    // move(fingerInput) {

    // };

    /**
     * touchend阶段触发
     * @param {Object} 手势数据 
     * @param {Boolean} 是否同时识别doubletap, 如果不识别,tap会反应快些(50ms)
     */
    end(fingerInput, recognizeDoubleTap = false) {
        const {
            offsetTime,
            absOffsetX,
            absOffsetY
        } = fingerInput;

        return new Promise((resolve, reject) => {
            // 判断是否[tap|doubletap]
            // 点击后250ms以内
            // 位移小于2px
            if (250 > offsetTime && 2 > absOffsetX && 2 > absOffsetY) {
                this.$fingerInput = fingerInput;
                // log(`recognizeDoubleTap: ${recognizeDoubleTap}`)
                if (recognizeDoubleTap) {
                    this.tapCount++;
                    clearTimeout(this.tapTimeout);
                    if (1 === this.tapCount) {
                        this.tapTimeout = setTimeout(() => {
                            this.type = 'tap';
                            this.tapCount = 0;
                            resolve(this.type);
                        }, 200);
                    } else if (2 === this.tapCount) {
                        this.type = 'doubletap';
                        this.tapCount = 0;
                        resolve(this.type);
                    }
                } else {
                    setTimeout(() => {
                        this.type = 'tap';
                        resolve(this.type);
                    }, 0);
                }
            }
        });
    };

    // cancel() {

    // };

    computedData() {
        return {
            type: this.type,
            nativeEvent: this.$fingerInput.nativeEvent,
            times: this.tapCount,
        }
    }
};