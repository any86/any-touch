import { Computed,RecognizerCallback } from '../interface';
export default class PanRecognizer {
    recognize(computed: Computed, callback: RecognizerCallback) {
        if (this.test(computed)) {
            callback({ type: 'pan', ...computed });
        }
    };

    test({ length, distance, status }: Computed) {
        return 'move' === status && 10 < distance && 1 === length;
    };
};