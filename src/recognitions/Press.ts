import { Computed, RecognizerCallback } from '../interface';
export default class PressRecognizer {
    private timeoutId: number;
    constructor() {
        this.timeoutId = null;
    };

    recognize(computed: Computed, callback: RecognizerCallback): void {
        const { status, distance, duration } = computed;
        if ('start' === status) {
            this.timeoutId = window.setTimeout(() => {
                callback({ type: 'press', ...computed });
            }, 250);
        } else if ('move' === status) {
            if (9 < distance) {
                this.cancel();
            }
        } else if ('end' === status) {
            if (251 > duration || 9 < distance) {
                this.cancel();
            }
        }
    };

    cancel() {
        clearTimeout(this.timeoutId);
    }
};