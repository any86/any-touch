export default class SwipeRecognizer {
    recognize(computed: any, callback: (paylod: any) => {}): void {
        if (this.test(computed)) {
            callback({ type: 'swipe', ...computed });
        }
    };

    test(computed: any): boolean {
        const { status, lastVelocityX, lastVelocityY, maxLength } = computed;
        console.log( maxLength, status, Math.max(Math.abs(lastVelocityX), Math.abs(lastVelocityY)));
        return 1 === maxLength && 'end' === status && 0.3 < Math.max(Math.abs(lastVelocityX), Math.abs(lastVelocityY));
    };
};