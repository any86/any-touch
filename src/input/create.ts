/**
 * 构造统一的touchEvent格式
 */
import { AnyInput } from '../interface';
import { propX, propY, SUPPORT_ONLY_TOUCH } from '../const';
import { getCenter } from '../vector';
import touchAdapter from './adapters/touch'
import mouseAdapter from './adapters/mouse';

export default (event: any): AnyInput => {

    let input: any;
    // Touch
    if (SUPPORT_ONLY_TOUCH) {
        input = touchAdapter(event);
    }
    // Mouse
    else {
        input = mouseAdapter(event);
        if (undefined === input) {
            return;
        }
    }

    // 当前触点数
    const pointerLength: number = input.pointers.length;

    // 变化前触点数
    const changedPointerLength: number = input.changedPointers.length;

    // 中心坐标
    let centerX: number, centerY: number;
    if(0 < pointerLength) {
        const { x, y } = getCenter(input.pointers);
        centerX = x;
        centerY = y;
    }

    // 当前时间
    const timestamp = Date.now();

    // 原生属性/方法
    const { target, currentTarget } = event;

    const stopPropagation = () => {
        event.stopPropagation();
    };

    const preventDefault = () => {
        event.preventDefault();
    };

    const stopImmediatePropagation = () => {
        event.stopImmediatePropagation();
    }

    return {
        ...input,
        stopPropagation,
        preventDefault,
        stopImmediatePropagation,
        pointerLength,
        changedPointerLength,
        centerX,
        centerY,
        timestamp,
        target,
        currentTarget,
        nativeEvent: event
    };
}