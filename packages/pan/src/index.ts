import type { EventTrigger, Computed, RecognizerFunction, RecognizerOptions } from '@any-touch/shared';
import { ComputeDistance, ComputeDeltaXY, ComputeVAndDir } from '@any-touch/compute';
import createContext, { recognizeForPressMoveLike, canResetStatusForPressMoveLike } from '@any-touch/recognizer';
const DEFAULT_OPTIONS = {
    name: 'pan',
    threshold: 10,
    pointLength: 1,
};


/**
 * 拖拽识别器
 * @param options 选项
 */
function Pan(options?: RecognizerOptions<typeof DEFAULT_OPTIONS>): ReturnType<RecognizerFunction> {
    const _context = createContext(DEFAULT_OPTIONS, options);
    let _isRecognized = false;

    /**
     * 必要条件
     * @param computed 计算数据
     * @return 是否是当前手势
     */
    function _test(computed: Computed): boolean {
        const { pointLength, distance } = computed;
        return (_isRecognized || _context.threshold <= distance) && _context.pointLength === pointLength;
    }

    /**
     * 开始识别
     * @param input 输入
     * @param emit 触发事件函数
     */
    function _recognize(computed: Computed, emit: EventTrigger) {
        // 重置status
        _context.status = canResetStatusForPressMoveLike(_context.status);

        // 需要有方向
        const isRecognizedNow =
            void 0 !== computed.direction &&
            recognizeForPressMoveLike(
                computed,
                _test,
                _context.name,
                _context.status,
                emit,
                ([isRecognized, status]) => {
                    _context.status = status;
                    _isRecognized = isRecognized;
                }
            );
        // panleft/panup/panright/pandown
        if (isRecognizedNow && void 0 !== computed.direction) {
            emit(_context.name + computed.direction);
        }
    }

    return [_context, _recognize,[ComputeVAndDir, ComputeDistance, ComputeDeltaXY]];
}
export default Pan;