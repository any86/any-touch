
import { Input,directionString } from '@/types';
import { CLIENT_X, CLIENT_Y,INPUT_START,INPUT_MOVE,INPUT_END } from '@/const';
import { getVLength, getDirection } from '@/vector';
import Store from '@/Store';
export default function ({
    startInput,
    input
}: {
    startInput: Input,
    input: Input
},$store:Store): { displacementX: number, displacementY: number, distanceX: number, distanceY: number, distance: number, overallDirection: directionString } {
    const { eventType } = input;
    let displacementX = 0;
    let displacementY = 0;
    if (INPUT_START === eventType) {
        $store.set({ displacementX });
        $store.set({ displacementY });
    } else if (INPUT_MOVE === eventType) {
        displacementX = Math.round(input!.points[0][CLIENT_X] - startInput!.points[0][CLIENT_X]);
        displacementY = Math.round(input!.points[0][CLIENT_Y] - startInput!.points[0][CLIENT_Y]);
        // 记录本次位移
        $store.set({ displacementX });
        $store.set({ displacementY });
    } else if (INPUT_END === eventType) {
        displacementX = $store.get('displacementX', 0);
        displacementY = $store.get('displacementY', 0);
    }

    const distanceX = Math.abs(displacementX);
    const distanceY = Math.abs(displacementY);
    const distance = Math.round(getVLength({ x: distanceX, y: distanceY }));
    const overallDirection = getDirection(displacementX, displacementY);
    return {
        displacementX, displacementY, distanceX, distanceY, distance, overallDirection
    };
};