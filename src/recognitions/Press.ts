import { Computed, RecognizerCallback } from '../interface';

import Base from './Base';
export default class PressRecognizer extends Base {
    private timeoutId: number;
    constructor(options: any) {
        super(options);
        this.timeoutId = null;
    };

    recognize(computed: Computed, callback: RecognizerCallback): void {
        const { inputStatus, distance, duration, maxPointerLength } = computed;
        if (1 < maxPointerLength) {
            this.cancel();
            return;
        } else {
            if ('start' === inputStatus) {
                this.timeoutId = window.setTimeout(() => {
                    callback({ ...computed, type: 'press' });
                }, 250);
            } else if ('move' === inputStatus) {
                if (9 < distance) {
                    this.cancel();
                }
            } else if ('end' === inputStatus) {
                if (251 > duration || 9 < distance) {
                    this.cancel();
                } else {
                    callback({ ...computed, type: 'pressup' });
                }
            }
        }
    };

    cancel() {
        clearTimeout(this.timeoutId);
    }
};