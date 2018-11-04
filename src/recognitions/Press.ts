import { Computed, RecognizerCallback } from '../interface';

import Base from './Base';
export default class PressRecognizer extends Base {
    private timeoutId: number;
    constructor(options: any) {
        super(options);
        this.timeoutId = null;
    };

    recognize(computed: Computed): void {
        const { inputStatus, distance, duration, maxPointerLength } = computed;
        if (1 < maxPointerLength) {
            this.cancel();
            return;
        } else {
            if ('start' === inputStatus) {
                this.timeoutId = window.setTimeout(() => {
                    this.emit('press', computed);
                }, 250);
            } else if ('move' === inputStatus) {
                if (9 < distance) {
                    this.cancel();
                }
            } else if ('end' === inputStatus) {
                if (251 > duration || 9 < distance) {
                    this.cancel();
                } else {
                    this.emit('pressup', computed);
                }
            }
        }
    };

    cancel() {
        clearTimeout(this.timeoutId);
    }
};