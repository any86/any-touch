import { Computed } from '../interface';
import {
    STATUS_RECOGNIZED,
    STATUS_POSSIBLE,
    STATUS_FAILED
} from '../const/recognizerStatus';
import Recognizer from './Base';
export default class PressRecognizer extends Recognizer {
    protected _timeoutId: number;
    constructor(options: any = { pointerLength: 1 }) {
        super(options);
        this._timeoutId = null;
    };

    getTouchAction(){
        return ['auto'];
    };

    recognize(computed: Computed): void {
        const { inputStatus, distance, duration} = computed;
        if (this.test(computed)) {
            if ('start' === inputStatus) {
                this._timeoutId = window.setTimeout(() => {
                    this.emit(this.options.name, computed);
                }, 250);
            } else if ('move' === inputStatus) {
                if (9 < distance) {
                    this.cancel();
                }
            } else if ('end' === inputStatus) {
                if (251 > duration || 9 < distance) {
                    this.cancel();
                } else {
                    this.emit(`${this.options.name}up`, computed);
                }
            }
        } else {
            this.cancel();
        }
    };

    public test({ pointerLength }: Computed): boolean {
        return 1 >= pointerLength;
    };

    protected cancel() {
        clearTimeout(this._timeoutId);
    }

    afterRecognized() { }
};