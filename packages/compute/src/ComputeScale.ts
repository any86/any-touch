import type { Input, Vector, Computed } from '@any-touch/shared';
import { round2 } from '@any-touch/shared';
import { getVLength } from '@any-touch/vector';

export default function () {
    let scale = 1;
    return function (
        input: Input, computed: Computed
    ) {
        let deltaScale = 1;
        const { prevVecotr, startVecotr, activeVecotr } = computed;
        if (activeVecotr) {
            deltaScale = round2(getVLength(activeVecotr) / getVLength(prevVecotr as Vector));
            scale = round2(getVLength(activeVecotr) / getVLength(startVecotr as Vector));
        }
        return { scale, deltaScale };
    };
}
