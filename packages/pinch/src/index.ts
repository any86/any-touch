import type { Computed, EventTrigger, RecognizerOptions, RecognizerFunction } from '@any-touch/shared';
import { RECOGNIZER_STATUS } from '@any-touch/shared';
import { ComputeScale } from '@any-touch/compute';
import { canResetStatusForPressMoveLike, recognizeForPressMoveLike } from '@any-touch/recognizer';
const DEFAULT_OPTIONS = {
    name: 'pinch',
    // 触发事件所需要的最小缩放比例
    threshold: 0,
    pointLength: 2,
};
export default function Pinch(options?: RecognizerOptions<typeof DEFAULT_OPTIONS>)
    : ReturnType<RecognizerFunction> {

    const _context = Object.assign(
        DEFAULT_OPTIONS,
        options,
        { status: RECOGNIZER_STATUS.POSSIBLE});
    let _isRecognized = false;

    /**
     * 识别条件
     * @param computed 计算数据
     * @return 接收是否识别状态
     */
    function _test(computed: Computed): boolean {
        const { pointLength, scale } = computed;
        return (
            _context.pointLength === pointLength &&
            void 0 !== scale &&
            (_context.threshold < Math.abs(scale - 1) || _isRecognized)
        );
    }

    /**
     * 开始识别
     * @param computed 计算数据
     */
    function _recognize(computed: Computed, emit: EventTrigger) {
        // 重置status
        _context.status = canResetStatusForPressMoveLike(_context.status);

        recognizeForPressMoveLike(computed,
            _test, _context.name,
            _context.status,
            emit,
            ([isRecognized, status]) => {
                _context.status = status;
                _isRecognized = isRecognized;
            });
    }
    return [_context, _recognize];
}

Pinch.C = [ComputeScale];
