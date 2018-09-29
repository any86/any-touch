export default class SwipeRecognizer {
    public name: string;

    constructor(){
        this.name = 'swipe'
    };

    recognize(computed: any, callback: (paylod: any) => {}): void {
        if (this.test(computed)) {
            // console.log(computed);
            // swipeleft | swiperight | swipedown | swipeup
            callback({ type: this.name + computed.direction, ...computed });

            callback({ type: this.name, ...computed });
        }
    };

    test(computed: any): boolean {
        const { status, lastVelocityX, lastVelocityY, maxLength } = computed;
        // console.log( maxLength, status, Math.max(Math.abs(lastVelocityX), Math.abs(lastVelocityY)));
        return 1 === maxLength && 'end' === status && 0.3 < Math.max(Math.abs(lastVelocityX), Math.abs(lastVelocityY));
    };
};