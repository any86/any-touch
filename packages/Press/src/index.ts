import { CommonEmitFunction, Input } from '@types';
import {
    STATUS_FAILED, STATUS_RECOGNIZED
} from '@any-touch/shared/const';
import ComputeDistance from '@any-touch/compute/ComputeDistance';
import { INPUT_CANCEL, INPUT_END, INPUT_START } from '@any-touch/shared/const';
import {DIRECTION_UP} from '@any-touch/vector/DIRECION';
import Recognizer from '@any-touch/Recognizer';
import resetStatus from '@any-touch/Recognizer/resetStatusForPressMoveLike';

export default class PressRecognizer extends Recognizer {
    private _timeoutId?: number;
    static DEFAULT_OPTIONS = {
        name: 'press',
        pointLength: 1,
        positionTolerance: 9,
        minPressTime: 251,
    };
    constructor(options = {}) {
        super(options);
    };

    recognize(input: Input, emit: CommonEmitFunction): void {
        const { inputType, startInput } = input;
        const deltaTime = input.timestamp - startInput.timestamp;
        // 1. start阶段
        // 2. 触点数符合
        // 那么等待minPressTime时间后触发press
        if (INPUT_START === inputType && this.test(input)) {
            // 重置状态
            resetStatus(this);
            // 延迟触发
            this.cancel();
            this._timeoutId = (setTimeout as Window['setTimeout'])(() => {
                this.status = STATUS_RECOGNIZED;
                emit(this.options.name, input);
            }, this.options.minPressTime);
        }

        // 触发pressup条件:
        // 1. end阶段
        // 2. 已识别
        else if (INPUT_END === inputType && STATUS_RECOGNIZED === this.status) {
            emit(`${this.options.name}${DIRECTION_UP}`, this.computed);
        }

        // 一旦不满足必要条件, 触发失败
        // 对应cancel和end阶段
        else if (!this.test(input) || (this.options.minPressTime > deltaTime && -1 !== [INPUT_END, INPUT_CANCEL].indexOf(inputType))) {
            this.cancel();
            this.status = STATUS_FAILED;
        }

    };

    /**
     * 是否满足:
     * 移动距离不大
     */
    test(input: Input): boolean {
        const { pointLength } = input;
        type Computed = ReturnType<ComputeDistance['compute']>;
        this.computed = <Computed>this.compute([ComputeDistance], input);
        const { distance } = this.computed;
        return this.options.positionTolerance > distance && this.isValidPointLength(pointLength);
    };

    cancel(): void {
        clearTimeout(this._timeoutId);
    }
};