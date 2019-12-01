
import { AnyTouchEvent, InputRecord, Store } from '@/types';
import intervalCompute from './intervalCompute';
import computeDistance from './computeDistance';
import computeDeltaXY from './computeDeltaXY';
import computeMaxLength from './computeMaxLength';
import computMulti from './computeMulti';

export default function (inputRecord: InputRecord, $store: Store) {
    const { id } = inputRecord.input;
    $store.set({ computeDistance: { [id]: computeDistance(inputRecord, $store) } });
    $store.set({ computeDeltaXY: { [id]: computeDeltaXY(inputRecord, $store) } });
};