import session from '../session';
export default class PanRecognizer {
    recognize(computedinput: any) {
        if (this.test(computedinput)) {
            session.eventBus.emit('pan', ({ type: 'pan', ...computedinput }));
        }
    };

    test(computedinput: any) {
        const { length, distance } = computedinput;
        return 'move' === session.inputStatus && 10 < distance && 1 === length;
    };
};