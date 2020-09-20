import type { EventTrigger, Computed, RecognizerOptions, RecognizerFunction } from '@any-touch/shared';
import {
    RECOGNIZER_STATUS, DIRECTION_UP, INPUT_START, INPUT_CANCEL, INPUT_END
} from '@any-touch/shared';
import { ComputeDistance } from '@any-touch/compute';

const DEFAULT_OPTIONS = {
    name: 'press',
    pointLength: 1,
    maxDistance: 9,
    minPressTime: 251,
};

/**
 * 按压识别器
 * @param options 选项
 */
export default function Press(options?: RecognizerOptions<typeof DEFAULT_OPTIONS>): ReturnType<RecognizerFunction> {
    const _context = Object.assign(
        DEFAULT_OPTIONS,
        options,
        { status: RECOGNIZER_STATUS.POSSIBLE});
    let _timeoutId: number | undefined;

    function _recognize(computed: Computed, emit: EventTrigger): void {
        const { stage, startInput, pointLength } = computed;
        // 1. start阶段
        // 2. 触点数符合
        // 那么等待minPressTime时间后触发press
        if (INPUT_START === stage && _context.pointLength === pointLength) {
            // 重置status
            _context.status = RECOGNIZER_STATUS.POSSIBLE;

            // _context.status = canResetStatusForPressMoveLike(_context.status);
            // 延迟触发
            _cancel();
            _timeoutId = (setTimeout as Window['setTimeout'])(() => {
                _context.status = RECOGNIZER_STATUS.RECOGNIZED;
                emit(_context.name);
            }, _context.minPressTime);
        }
        // 触发pressup条件:
        // 1. end阶段
        // 2. 已识别
        else if (INPUT_END === stage && RECOGNIZER_STATUS.RECOGNIZED === _context.status) {
            emit(`${_context.name}${DIRECTION_UP}`);
        }
        else if (RECOGNIZER_STATUS.RECOGNIZED !== _context.status) {
            const deltaTime = computed.timestamp - startInput.timestamp;
            // 一旦不满足必要条件,
            // 发生了大的位移变化
            if (!_test(computed) ||
                // end 或 cancel触发的时候还不到要求的press触发时间
                (_context.minPressTime > deltaTime && [INPUT_END, INPUT_CANCEL].includes(stage))) {
                _cancel();
                _context.status = RECOGNIZER_STATUS.FAILED;
            }
        }
    };

    /**
     * 是否满足:
     * 移动距离不大
     */
    function _test(computed: Computed): boolean {
        const { distance } = computed;
        return _context.maxDistance > distance;
    };

    function _cancel(): void {
        clearTimeout(_timeoutId);
    }

    return [_context, _recognize];
};


Press.C = [ComputeDistance];