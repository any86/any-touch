import { Computed } from '../interface';
import { Options } from '../../types/recognition';
import {
    STATUS_POSSIBLE,
    STATUS_CANCELLED,
    STATUS_FAILED, STATUS_RECOGNIZED
} from '../const/recognizerStatus';
import { INPUT_CANCEL, INPUT_END, INPUT_MOVE, INPUT_START } from '../const';
import Recognizer from './Base';
export default class PressRecognizer extends Recognizer {
    protected _timeoutId: number;
    constructor(options: Options = {}) {
        super(options);
        this._timeoutId = null;
    };

    getTouchAction() {
        return ['auto'];
    };

    recognize(computed: Computed): void {
        if (this.options.disabled) return;
        const { inputStatus, distance, duration } = computed;
        // 手指一直按住屏幕
        if (this.test(computed)) {
            if (this.options.threshold < distance ) {
                this.cancel();
            } else {
                this._timeoutId = window.setTimeout(() => {
                    this.status = STATUS_RECOGNIZED;
                    this.emit(this.options.name, computed);
                }, this.options.minPressTime);
            }
        }
        // 已识别, end阶段触发pressup
        else if (STATUS_RECOGNIZED === this.status && INPUT_END === inputStatus) {
            this.emit(`${this.options.name}up`, computed);
            // 复位状态
            this.status = STATUS_POSSIBLE;
        } else {
            this.cancel();
            this.status = STATUS_FAILED;
        }
    };

    public test({ pointerLength }: Computed): boolean {
        return this.isValidPointerLength(pointerLength);
    };

    protected cancel() {
        clearTimeout(this._timeoutId);
        this.status = STATUS_FAILED;
    }

    afterRecognized() { }
};

// 默认参数
PressRecognizer.prototype.defaultOptions = {
    name: 'press',
    pointerLength: 1,
    threshold:9,
    minPressTime: 251,
    disabled: false
};