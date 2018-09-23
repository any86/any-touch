import { Computed, RecognizerCallback } from '../interface';
import Base from './Base';
export default class PinchRecognizer extends Base {
    recognize(computed: Computed, callback: RecognizerCallback) {
        let eventStatus: string;
        if (this.test(computed)) {
            callback({ type: 'pinch', ...computed });
            console.log(computed.status);
            // pinchstart | pinchmove | pinchend
            eventStatus = this.recognizeStatus(computed.status);
            callback({ type: 'pinch' + eventStatus, ...computed });
        }
    };

    test({ length }: Computed) {
        // console.log(length || 0);
        return 1 < length;
    };
};