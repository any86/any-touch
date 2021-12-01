import type { PluginContext } from '@any-touch/shared';
import {
    isRecognized,
    resetState,
    isDisabled,
    flow,
    getStatusName,
    createPluginContext,
    TYPE_END,
    TYPE_CANCEL,
} from '@any-touch/shared';
import { ComputeAngle, ComputeVectorForMutli } from '@any-touch/compute';
import Core from '@any-touch/core';
const DEFAULT_OPTIONS = {
    name: 'rotate',
    // 触发事件所需要的最小角度
    threshold: 0,
    pointLength: 2,
};

/**
 * 实例
 */
type RotateContext = PluginContext & typeof DEFAULT_OPTIONS;

/**
 * 扩展插件映射
 */
declare module '@any-touch/core' {
    interface PluginContextMap {
        rotate: RotateContext;
    }
}



/**
 * "旋转"识别器
 * @param at AnyTouch实例
 * @param options 识别器选项
 * @returns
 */
export default function (at: Core, options?: Partial<typeof DEFAULT_OPTIONS>) {
    const context = createPluginContext(DEFAULT_OPTIONS, options);


    // 加载计算方法, 有前后顺序
    at.compute([ComputeVectorForMutli, ComputeAngle], (computed) => {
        // 禁止
        if (isDisabled(context)) return;

        // 重置status
        resetState(context);

        const isValid = test();
        context.state = flow(isValid, context.state, computed.phase);
        const { name } = context;
        if (isValid) {
            at.emit2(name, computed, context);
        }

        const stateName = getStatusName(context.state);
        if (stateName) {
            at.emit2(name + stateName, computed, context);
        }

        // 是否满足条件
        function test() {
            const { pointLength, angle, phase } = computed;
            return (
                (context.pointLength === pointLength && (context.threshold < Math.abs(angle) || isRecognized(context.state))) ||
                // rotateend | rotatecancel
                (isRecognized(context.state) && [TYPE_END, TYPE_CANCEL].includes(phase))
            );
        }
    });
    return context;
}


