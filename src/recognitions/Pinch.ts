import session from '../session';
export default class PinchRecognizer {
    recognize(computedinput: any, callback: (paylod: any) => {}) {
        if (this.test(computedinput)) {
            callback({ type: 'pinch', ...computedinput });
        }
    };

    test({ length }: any) {
        return 1 < length;
    };
};