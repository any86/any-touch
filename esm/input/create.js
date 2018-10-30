import { IS_MOBILE } from '../const';
import { getCenter } from '../vector';
import touchAdapter from './adapters/touch';
import mouseAdapter from './adapters/mouse';
let centerX;
let centerY;
export default (event) => {
    let input = {};
    if (IS_MOBILE) {
        input = touchAdapter(event);
    }
    else {
        input = mouseAdapter(event);
        if (undefined === input) {
            return;
        }
    }
    const { nativeEventType, pointers, changedPointers } = input;
    const pointerLength = pointers.length;
    const changedPointerLength = changedPointers.length;
    const isFirst = ('start' === nativeEventType) && (0 === changedPointerLength - pointerLength);
    const isFinal = ('end' === nativeEventType) && (0 === pointerLength);
    if (0 < pointerLength) {
        const { x, y } = getCenter(input.pointers);
        centerX = x;
        centerY = y;
    }
    const timestamp = Date.now();
    const { target, currentTarget } = event;
    const stopPropagation = () => {
        event.stopPropagation();
    };
    const preventDefault = () => {
        event.preventDefault();
    };
    const stopImmediatePropagation = () => {
        event.stopImmediatePropagation();
    };
    return Object.assign({}, input, { isFirst,
        isFinal,
        stopPropagation,
        preventDefault,
        stopImmediatePropagation,
        pointerLength,
        changedPointerLength,
        centerX,
        centerY,
        timestamp,
        target,
        currentTarget, nativeEvent: event });
};
