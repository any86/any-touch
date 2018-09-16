export default class RotateRecognizer {
    recognize(computedinput: any, callback: (paylod: any) => {}) {
        if (this.test(computedinput)) {
            callback({ type: 'rotate', ...computedinput });
        }
    };

    test(computedinput: any) {
        return 1 < computedinput.length;
    };
};