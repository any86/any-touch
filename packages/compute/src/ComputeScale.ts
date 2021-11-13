import type { Input, Vector, Computed } from '@any-touch/shared';
import { round2 } from '@any-touch/shared';
import { getVLength } from '@any-touch/vector';

export default function () {
    return function (
        input: Input, computed: Computed
    ) {
        const { prevVecotr, startVecotr, activeVecotr } = computed;
        if (activeVecotr) {
            const deltaScale = round2(getVLength(activeVecotr) / getVLength(prevVecotr as Vector));
            const scale = round2(getVLength(activeVecotr) / getVLength(startVecotr as Vector));
            return { scale, deltaScale };
        }
    };
}
