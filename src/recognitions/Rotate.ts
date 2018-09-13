import session from '../session';
export default class RotateRecognizer {
    recognize(computedinput: any) {
        if (this.test(computedinput)) {
            session.eventBus.emit('rotate', { type: 'rotate', ...computedinput });
        }
    };

    test(computedinput: any) {
        return 1 < computedinput.length;
    };
};