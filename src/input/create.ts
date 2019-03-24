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
    // 通过TouchEvent|MouseEvent获取的直接数据
    let baseInput: BaseInput;

    // Touch
    if (SUPPORT_TOUCH) {
        baseInput = touchAdapter(<TouchEvent>event);
    }
    // Mouse
    else {
        baseInput = <BaseInput>mouseAdapter(<MouseEvent>event);
        if (undefined === baseInput) {
            return;
        }
    }
    const { eventType, points, changedPoints } = baseInput;
    // 当前触点数
    const pointLength: number = points.length;

    // 变化前触点数
    const changedpointLength: number = changedPoints.length;
    // 识别流程的开始和结束标记
    const isFirst = (INPUT_START === eventType) && (0 === changedpointLength - pointLength);
    const isFinal = (INPUT_END === eventType || INPUT_CANCEL === eventType) && (0 === pointLength);

    // 中心坐标
    if (0 < pointLength) {
        _center = getCenter(baseInput.points);
    }

    // 当前时间
    const timestamp = Date.now();

    // 原生属性/方法
    const { target, currentTarget } = event;
    const { x, y } = <Point>(_center || {});
    return {
        ...baseInput,
        preventDefault: ()=>{
            event.preventDefault();
        },
        isFirst,
        isFinal,
        pointLength,
        changedpointLength,
        center: _center,
        x, y,
        timestamp,
        target,
        currentTarget,
        nativeEvent: event
    };
}