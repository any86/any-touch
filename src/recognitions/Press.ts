import { Computed, RecognizerCallback } from '../interface';

import Base from './Base';
export default class PressRecognizer extends Base {
    private timeoutId: number;
    constructor(options:any) {
        super(options);
        this.timeoutId = null;
    };

    recognize(computed: Computed, callback: RecognizerCallback): void {
        const { inputStatus, distance, duration, maxLength } = computed;
        if(1 < maxLength){
            this.cancel();
            return;
        } else {
            if ('start' === inputStatus) {
                this.timeoutId = window.setTimeout(() => {
                    callback({ type: 'press', ...computed });
                }, 250);
            } else if ('move' === inputStatus) {
                if (9 < distance) {
                    this.cancel();
                }
            } else if ('end' === inputStatus) {
                if (251 > duration || 9 < distance) {
                    this.cancel();
                } else {
                    callback({ type: 'pressup', ...computed });
                }
            }
        }
    };

    cancel() {
        clearTimeout(this.timeoutId);
    }
};