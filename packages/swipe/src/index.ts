import type { Computed, PluginContext, Input } from '@any-touch/shared';
import { TYPE_END, STATE, createPluginContext, TYPE_COMPUTED } from '@any-touch/shared';
import { ComputeDistance, ComputeVAndDir, ComputeMaxLength } from '@any-touch/compute';
import Core from '@any-touch/core';
const DEFAULT_OPTIONS = {
    name: 'swipe',
    threshold: 10,
    velocity: 0.3,
    pointLength: 1,
};

/**
 * "拖拽"识别器
 * @param at AnyTouch实例
 * @param options 识别器选项
 * @returns
 */
export default function (at: Core, options?: Partial<typeof DEFAULT_OPTIONS>) {
    const context = createPluginContext(DEFAULT_OPTIONS, options);

    // 加载计算方法
    at.compute([ComputeDistance, ComputeVAndDir, ComputeMaxLength], (computed) => {
        context.state = STATE.POSSIBLE;
        if (context.disabled) return;

        if (test()) {
            const { name } = context;
            context.state = STATE.RECOGNIZED;
            at.emit2(name, computed, context);
            at.emit2(name + computed.direction, computed, context);
        }

        // 是否满足条件
        function test() {
            if (TYPE_END !== computed.phase) return false;
            const { velocityX, velocityY, distance, maxPointLength } = computed;
            return (
                maxPointLength === context.pointLength &&
                // 开启vPointLengh的情况, 用户就很难实现多手指swipe
                // context.pointLength === vPointLengh &&
                0 === computed.points.length &&
                context.threshold < distance &&
                context.velocity < Math.max(velocityX, velocityY)
            );
        }
    });
    return context;
}

