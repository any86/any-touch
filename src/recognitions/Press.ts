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
    private _isPressing: boolean;
    constructor(options: Options = {}) {
        super(options);
        this._timeoutId = null;
        this._isPressing = false;
    };

    getTouchAction() {
        return ['auto'];
    };

    recognize(computed: Computed): void {
        if (this.options.disabled) return;
        const { inputStatus } = computed;
        // 手指一直按住屏幕
        if (STATUS_RECOGNIZED !== this.status) {
            // 如果未开始按住屏幕 && 限制条件已经通过
            // 那么延迟触发press
            const IS_VALID = this.test(computed);
            if (!this._isPressing && IS_VALID) {
                this._isPressing = true;
                this._timeoutId = window.setTimeout(() => {
                    this.status = STATUS_RECOGNIZED;
                    this.emit(this.options.name, computed);
                }, this.options.minPressTime);
            } else {
                if(!IS_VALID) {
                    this.cancel();
                }
            }
        }
        // 已识别 
        else {
            // end阶段触发pressup
            if (INPUT_END === inputStatus) {
                this.emit(`${this.options.name}up`, computed);
                // 复位状态
                this.status = STATUS_POSSIBLE;
                this._isPressing = false;
            }
        }
    };

    public test({ pointerLength, inputStatus, distance }: Computed): boolean {
        const IS_VALID_INPUT = 'start' === inputStatus || 'move' === inputStatus;
        const IS_VLIAD_DISTANCE = this.options.threshold > distance;
        return this.isValidPointerLength(pointerLength) && IS_VALID_INPUT && IS_VLIAD_DISTANCE;
    };

    protected cancel() {
        clearTimeout(this._timeoutId);
        this.status = STATUS_FAILED;
        this._isPressing = false;
    }

    afterRecognized() { }
};

// 默认参数
PressRecognizer.prototype.defaultOptions = {
    name: 'press',
    pointerLength: 1,
    threshold: 9,
    minPressTime: 251,
    disabled: false
};