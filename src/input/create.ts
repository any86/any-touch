/**
 * 构造统一的Input格式
 */
import { Input, BaseInput, Point } from '../interface';
import { SUPPORT_TOUCH, INPUT_END, INPUT_START, INPUT_CANCEL } from '../const';
import { getCenter } from '../vector';
import touchAdapter from './adapters/touch'
import mouseAdapter from './adapters/mouse';

// 缓存触点中心
let _center: Point;

export default (event: Event): Input | void => {
    let input: BaseInput;

    // Touch
    if (SUPPORT_TOUCH) {
        input = touchAdapter(<TouchEvent>event);
    }
    // Mouse
    else {
        input = <BaseInput>mouseAdapter(<MouseEvent>event);
        if (undefined === input) {
            return;
        }
    }
    const { eventType, pointers, changedPointers } = input;
    // 当前触点数
    const pointerLength: number = pointers.length;

    // 变化前触点数
    const changedPointerLength: number = changedPointers.length;
    // 识别流程的开始和结束标记
    const isFirst = (INPUT_START === eventType) && (0 === changedPointerLength - pointerLength);
    const isFinal = (INPUT_END === eventType || INPUT_CANCEL === eventType) && (0 === pointerLength);

    // 中心坐标
    if (0 < pointerLength) {
        _center = getCenter(input.pointers);
    }

    // 当前时间
    const timestamp = Date.now();

    // 原生属性/方法
    const { target, currentTarget } = event;
    const { x, y } = <Point>(_center || {});
    return {
        ...input,
        preventDefault: ()=>{
            event.preventDefault();
        },
        isFirst,
        isFinal,
        pointerLength,
        changedPointerLength,
        center: _center,
        x, y,
        timestamp,
        target,
        currentTarget,
        nativeEvent: event
    };
}