import type { Input, Computed, Vector } from '@any-touch/shared';
import { getAngle } from '@any-touch/vector';
/**
 * 计算角度
 * @param  input 输入
 */
export default function ComputeAngle() {
    return function (input: Input, computed: Computed) {
        const { prevVecotr, startVecotr, activeVecotr } = computed;
        if (activeVecotr) {
            const deltaAngle = Math.round(getAngle(activeVecotr, prevVecotr as Vector));
            const angle = Math.round(getAngle(activeVecotr, startVecotr as Vector));
            return { angle, deltaAngle };
        }
    };
}
