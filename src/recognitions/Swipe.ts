export default class SwipeRecognizer {
    recognize(computedInput: any, callback: (paylod: any) => {}): void {
        if (this.test(computedInput)) {
            callback({ type: 'swipe', ...computedInput });
        }
    };
    
    test(computedInput: any): boolean {
        const { status, lastVelocityX, lastVelocityY, maxLength } = computedInput;
        return 1 === maxLength && 'end' === status && 0.3 < Math.max(Math.abs(lastVelocityX), Math.abs(lastVelocityY));
    };
};