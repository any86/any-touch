import { AnyTouchEvent, InputRecord } from '@/types';
import {
    STATUS_FAILED, STATUS_RECOGNIZED
} from '../const/recognizerStatus';
import computeDistance from '@/compute/computeDistance';
import { INPUT_CANCEL, INPUT_END, INPUT_START, AUTO, DIRECTION_UP, KEY_DISTANCE } from '@/const';
import RecognizerWithRequireFailure from './RecognizerWithRequireFailure';
import {resetStatus} from './recognizeForPressMoveLike';

export default class PressRecognizer extends RecognizerWithRequireFailure {
    private _timeoutId?: any;
    static DEFAULT_OPTIONS = {
        name: 'press',
        pointLength: 1,
        positionTolerance: 9,
        minPressTime: 251,
    };
    constructor(options = {}) {
        super(options);
    };

    getTouchAction(): string[] {
        return [AUTO];
    };

    recognize(inputRecord: InputRecord): void {
        const { input } = inputRecord;
        const { eventType } = input;
        const deltaTime = inputRecord.input.timestamp - inputRecord.startInput.timestamp;
        // 1. start阶段
        // 2. 触点数符合
        // 那么等待minPressTime时间后触发press
        if (INPUT_START === eventType && this.test(inputRecord)) {
            // 重置状态
            resetStatus(this);
            // 延迟触发
            this.cancel();
            this._timeoutId = (setTimeout as Window['setTimeout'])(() => {
                this.status = STATUS_RECOGNIZED;
                this.emit(this.options.name, input);
            }, this.options.minPressTime);
        }

        // 触发pressup条件:
        // 1. end阶段
        // 2. 已识别
        else if (INPUT_END === eventType && STATUS_RECOGNIZED === this.status) {
            this.emit(`${this.options.name}${DIRECTION_UP}`, this.event);
        }

        // 一旦不满足必要条件, 触发失败
        // 对应cancel和end阶段
        else if (!this.test(inputRecord) || (this.options.minPressTime > deltaTime && -1 !== [INPUT_END, INPUT_CANCEL].indexOf(eventType))) {
            this.cancel();
            this.status = STATUS_FAILED;
        }

    };

    /**
     * 是否满足:
     * 移动距离不大
     */
    test(inputRecord: InputRecord): boolean {
        const { input } = inputRecord;
        const { pointLength } = input;
        // displacementX, displacementY, distanceX, distanceY, distance, overallDirection
        const computeDistanceData = this._getComputed(computeDistance, inputRecord, <any>this.$store);
        const { distance } = computeDistanceData;
        this.event = { ...this.event, ...computeDistanceData }
        return this.options.positionTolerance > distance && this.isValidPointLength(pointLength);
    };

    cancel(): void {
        clearTimeout(this._timeoutId);
    }

    afterEmit() { }
};