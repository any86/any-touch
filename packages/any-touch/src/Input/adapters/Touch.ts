import { BaseInput, InputType } from '@types';
import Adapter from './Abstract';
export default class extends Adapter {
    load(event: TouchEvent): Omit<BaseInput,'id'>  {
        // fix: wx下没有targetTouches
        const points = Array.from(event.targetTouches || event.touches).map(({ clientX, clientY }) => ({ clientX, clientY }));
        const changedPoints = Array.from(event.changedTouches).map(({ clientX, clientY }) => ({ clientX, clientY }));
        return {
            inputType: <InputType>event.type.replace('touch', ''),
            changedPoints,
            points,
            nativeEvent: event,
            target:event.target
        };
    }
}; 