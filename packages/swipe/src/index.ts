import type { EventTrigger, Computed, RecognizerOptions, RecognizerFunction, ComputedRequired } from '@any-touch/shared';
import { STAGE, RECOGNIZER_STATUS } from '@any-touch/shared';
import { ComputeDistance, ComputeVAndDir, ComputeMaxLength } from '@any-touch/compute';
import createContext from '@any-touch/recognizer';

const DEFAULT_OPTIONS = {
    name: 'swipe',
    threshold: 10,
    velocity: 0.3,
    pointLength: 1,
};

export default function Press(options?: RecognizerOptions<typeof DEFAULT_OPTIONS>): ReturnType<RecognizerFunction> {
    const _context = createContext(DEFAULT_OPTIONS, options);

    /**
     * 识别条件
     * @param computed 计算数据
     */
    function _test(computed: Computed): boolean {
        // 非end阶段, 开始校验数据
        if (STAGE.END !== computed.stage) return false;
        const { velocityX, velocityY, maxPointLength, distance } = computed as ComputedRequired<typeof ComputeDistance, typeof ComputeVAndDir, typeof ComputeMaxLength>;
        return _context.pointLength === maxPointLength &&
            _context.threshold < distance &&
            _context.velocity < Math.max(velocityX, velocityY);
    };

    /**
     * 开始识别
     * @param computed 计算数据 
     */
    function _recognize(computed: Computed, emit: EventTrigger) {
        _context.status = RECOGNIZER_STATUS.POSSIBLE;
        if (_test(computed)) {
            _context.status = RECOGNIZER_STATUS.RECOGNIZED;
            emit(_context.name);
            // swipeleft...
            emit(_context.name + computed.direction);
        }

    };

    return [_context, _recognize, [ComputeDistance, ComputeVAndDir, ComputeMaxLength]];
};
