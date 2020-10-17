import type { EventTrigger, Computed } from '@any-touch/shared';
import {
    STATUS_FAILED, STATUS_RECOGNIZED, DIRECTION_UP, INPUT_CANCEL, INPUT_END, INPUT_START
} from '@any-touch/shared';
import { ComputeDistance } from '@any-touch/compute';
import Recognizer, { resetStatusForPressMoveLike as resetStatus } from '@any-touch/recognizer';
const DEFAULT_OPTIONS = {
    name: 'press',
    pointLength: 1,
    maxDistance: 9,
    minPressTime: 251,
};
export default class extends Recognizer {
    private _timeoutId?: number;

    constructor(options: Partial<typeof DEFAULT_OPTIONS>) {
        super({ ...DEFAULT_OPTIONS, ...options });
        this.computeFunctions = [ComputeDistance];
    };

    recognize(computed: Computed, emit: EventTrigger): void {
        const { stage, startInput, pointLength } = computed;
        // 1. start阶段
        // 2. 触点数符合
        // 那么等待minPressTime时间后触发press
        if (INPUT_START === stage && this._$isValidPointLength(pointLength)) {
            // 重置状态
            resetStatus(this);
            // 延迟触发
            this._$cancel();
            this._timeoutId = (setTimeout as Window['setTimeout'])(() => {
                this.status = STATUS_RECOGNIZED;
                emit(this.options.name);
            }, this.options.minPressTime);
        }
        // 触发pressup条件:
        // 1. end阶段
        // 2. 已识别
        else if (INPUT_END === stage && STATUS_RECOGNIZED === this.status) {
            emit(`${this.options.name}${DIRECTION_UP}`);
        }
        else if (STATUS_RECOGNIZED !== this.status) {
            const deltaTime = computed.timestamp - startInput.timestamp;
            // 一旦不满足必要条件,
            // 发生了大的位移变化
            if (!this._$test(computed) ||
                // end 或 cancel触发的时候还不到要求的press触发时间
                (this.options.minPressTime > deltaTime && [INPUT_END, INPUT_CANCEL].includes(stage))) {
                this._$cancel();
                this.status = STATUS_FAILED;
            }
        }
    };

    /**
     * 是否满足:
     * 移动距离不大
     */
    _$test(computed: Computed): boolean {
        const { distance } = computed;
        return this.options.maxDistance > distance;
    };

    _$cancel(): void {
        clearTimeout(this._timeoutId);
    }
};