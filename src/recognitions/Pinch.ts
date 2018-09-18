import { Computed,RecognizerCallback } from '../interface';
export default class PinchRecognizer {
    recognize(computed: Computed, callback: RecognizerCallback) {
        if (this.test(computed)) {
            callback({ type: 'pinch', ...computed });
        }
    };

    test({ length }: Computed) {
        return 1 < length;
    };
};