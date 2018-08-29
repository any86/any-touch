export default class PressRecognizer {

    constructor() {
        this.type = 'pressup';
        this.$fingerInput = {};
        this.pressTimeout = null;
    };

    start(fingerInput) {
        this.$fingerInput = fingerInput;
        return new Promise((resolve, reject) => {
            try {
                this.pressTimeout = setTimeout(() => {
                    this.type = 'press';
                    resolve('press');
                }, 251);
            } catch (error) {
                reject(error);
            }
        });
    };

    move(fingerInput) {
        this.$fingerInput = fingerInput;
        if (9 < this.$fingerInput.absDeltaX || 9 < this.$fingerInput.absDeltaY) {
            this.cancel();
        }
    };

    end(fingerInput) {
        this.$fingerInput = fingerInput;
        const {absOffsetX, absOffsetY, offsetTime, nativeEvent} = fingerInput;
        // 取消[press]
        // 251ms内触点离开屏幕
        // 或者, 与起点偏移大于9px
        if (251 > offsetTime || 9 < absOffsetX || 9 < absOffsetY) {
            this.cancel();
        } else {
            // 识别[pressup]
            this.type = 'pressup';
            return this.type;
        }
    };

    cancel() {
        clearTimeout(this.pressTimeout);
        this.pressTimeout = null;
    };

    computedData() {
        return {
            type: this.type,
            nativeEvent: this.$fingerInput.nativeEvent,
        }
    }
};