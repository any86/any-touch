import type { Computed, EventTrigger, RecognizerOptions, RecognizerFunction, ComputedRequired } from '@any-touch/shared';
import { ComputeAngle } from '@any-touch/compute';
import createContext, { canResetStatusForPressMoveLike, recognizeForPressMoveLike } from '@any-touch/recognizer';

const DEFAULT_OPTIONS = {
    name: 'rotate',
    // 触发事件所需要的最小角度
    threshold: 0,
    pointLength: 2,
};
export default function Rotate(options?: RecognizerOptions<typeof DEFAULT_OPTIONS>): ReturnType<RecognizerFunction> {
    const _context = createContext(DEFAULT_OPTIONS, options);
    let _isRecognized = false;

    /**
     * 识别条件
     * @param computed 计算数据
     * @return 接收是否识别状态
     */
    function _test(computed: Computed): boolean {
        const _c = computed as ComputedRequired<typeof ComputeAngle>
        if (`angle` in _c && void 0 !== _c.angle) {
            const { pointLength, angle } = _c;
            return _context.pointLength === pointLength && (_context.threshold < Math.abs(angle) || _isRecognized);
        }
        return false;
    };

    /**
     * 开始识别
     * @param computed 计算数据
     */
    function _recognize(computed: Computed, emit: EventTrigger) {
        // 重置status
        _context.status = canResetStatusForPressMoveLike(_context.status);

        recognizeForPressMoveLike(computed, _test, _context.name, _context.status, emit, ([isRecognized, status]: any) => {
            _context.status = status;
            _isRecognized = isRecognized;
        });
    };
    return [_context, _recognize, [ComputeAngle]];
};
