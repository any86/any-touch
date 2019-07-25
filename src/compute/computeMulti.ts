
import computeVector from './computeVector';
import computeScale from './computeScale';
import computeAngle from './computeAngle';
import Store from '../Store';

export default function ({
    startMultiInput,
    prevInput,
    input
}: any, $store:Store): {
    scale: number;
    deltaScale: number;
    angle: number;
    deltaAngle: number
} {
    // 上一触点数大于1, 当前触点大于1
    // 连续第二次出现多点, 才能开始计算
    if (undefined !== prevInput && 1 < prevInput.points.length && 1 < input.points.length) {
        // 2指形成的向量
        const startV = computeVector(startMultiInput);
        const prevV = computeVector(prevInput);
        const activeV = computeVector(input);
        // 计算缩放
        const { scale, deltaScale } = computeScale({
            startV, activeV, prevV
        });

        // ========= 计算旋转角度 =========
        const { deltaAngle, angle } = computeAngle({ startV, prevV, activeV });
        $store.set({ angle });
        $store.set({ scale });
        return { scale, deltaScale, deltaAngle, angle };
    } else {
        return {
            scale: $store.get('scale', 1),
            deltaScale: 1,
            deltaAngle: 0,
            angle: $store.get('angle', 0)
        };
    }
};