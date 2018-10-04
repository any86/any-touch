import { Computed, RecognizerCallback } from '../interface';
export default class PressRecognizer {
    private timeoutId: number;
    constructor() {
        this.timeoutId = null;
    };

    recognize(computed: Computed, callback: RecognizerCallback): void {
        const { nativeEventType, distance, duration, maxLength } = computed;
        if(1 < maxLength){
            this.cancel();
            return;
        } else {
            if ('start' === nativeEventType) {
                this.timeoutId = window.setTimeout(() => {
                    callback({ type: 'press', ...computed });
                }, 250);
            } else if ('move' === nativeEventType) {
                if (9 < distance) {
                    this.cancel();
                }
            } else if ('end' === nativeEventType) {
                if (251 > duration || 9 < distance) {
                    this.cancel();
                }
            }
        }
    };

    cancel() {
        clearTimeout(this.timeoutId);
    }
};