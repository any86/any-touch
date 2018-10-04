import { Computed, RecognizerCallback } from '../interface';
import Base from './Base';
export default class PinchRecognizer extends Base {
    recognize(computed: Computed, callback: RecognizerCallback) {
        let eventnativeEventType: string;
        if (this.test(computed)) {
            callback({ type: 'pinch', ...computed });
            // console.log(computed.nativeEventType);
            // pinchstart | pinchmove | pinchend
            eventnativeEventType = this.recognizenativeEventType(computed.nativeEventType);
            callback({ type: 'pinch' + eventnativeEventType, ...computed });
        }
    };

    test({ length }: Computed) {
        // console.log(length || 0);
        return 1 < length;
    };
};