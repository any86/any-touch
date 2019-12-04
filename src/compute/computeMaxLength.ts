import Store from '@/Store';
import { InputRecord } from '@/types';
export default (inputRecord:InputRecord, $store: Store): number => {
    if (inputRecord && inputRecord.input && inputRecord.input.isStart) {
        $store.set({ maxPointLength:inputRecord.input.pointLength });
        return inputRecord.input.pointLength;
    }
    return $store.get('maxPointLength', 0)
};