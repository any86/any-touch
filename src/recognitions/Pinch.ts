import session from '../session';
export default class PinchRecognizer {
    recognize(computedinput: any) {
        if (this.test(computedinput)) {
            session.eventBus.emit('pinch', { type: 'pinch', ...computedinput });
        }
    };

    test(computedinput: any) {
        return 1 < computedinput.length;
    };
};