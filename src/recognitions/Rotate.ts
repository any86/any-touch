export default class RotateRecognizer {
    recognize(computed: any, callback: (paylod: any) => {}) {
        if (this.test(computed)) {
            callback({ type: 'rotate', ...computed });
        }
    };

    test({length}:any) {
        return 1 < length;
    };
};