import Store from '@any-touch/Store';
import { InputRecord } from '@types';
/**
 * 每次start阶段的触点数字作为最大触点数
 * 注意:
 * 函数名不可以不写, 
 * jest编译的时候, 会作为匿名函数使用, 
 * 这样才_getComputed方法中就取不到Function.name
 * @param inputRecord 
 * @param $store 
 */
export default function computeMaxLength(inputRecord: InputRecord, $store: Store): number {
    if (inputRecord && inputRecord.input && inputRecord.input.isStart) {
        $store.set({ maxPointLength: inputRecord.input.pointLength });
        return inputRecord.input.pointLength;
    }
    return $store.get('maxPointLength', 0)
};