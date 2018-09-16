import session from '../session';
export default class PanRecognizer {
    recognize(computedinput: any, callback: (paylod: any) => {}): void {
        if (this.test(computedinput)) {
            callback({ type: 'pan', ...computedinput });
        }
    };

    test(computedinput: any) {
        const { length, distance,status } = computedinput;
        return 'move' === status && 10 < distance && 1 === length;
    };
};