/**
 * 构造统一的Input格式
 */
import { Input, Point, SupportEvent } from '../interface';
import { SUPPORT_TOUCH, INPUT_END, INPUT_START, INPUT_CANCEL } from '../const';
import { getCenter } from '../vector';
import Touch from './adapters/Touch';
import Mouse from './adapters/Mouse';
import Adapter from './adapters/Abstract';

export default class {
    // 缓存触点中心
    private _center?: Point;
    public adapter: Adapter;
    constructor() {
        this.adapter = SUPPORT_TOUCH ? new Touch() : new Mouse();
    };

    public load(event: SupportEvent): Input | void {
        // 从event中采集的数据
        const BASE_INPUT = this.adapter.load(event);

        if (undefined === BASE_INPUT) {
            return;
        }
        const { eventType, points, changedPoints } = BASE_INPUT;
        // 当前触点数
        const pointLength = points.length;

        // 变化前触点数
        const changedPointLength = changedPoints.length;

        // 识别流程的开始和结束标记
        // 只要触点增加了就是一个识别阶段的"开始"
        const isStart = (INPUT_START === eventType)
        // 任意触点离开算作"结束", 这和hammer.js不一样
        // 注意这个"结束"只能给pan等移动类手势用, tap比较特殊, 不会用到这个属性
        const isEnd = (INPUT_END === eventType || INPUT_CANCEL === eventType);
        //  && (0 === pointLength);

        // 中心坐标
        if (0 < pointLength) {
            this._center = getCenter(BASE_INPUT.points);
        }

        // 当前时间
        const timestamp = Date.now();

        // 原生属性/方法
        const { target, currentTarget } = event;
        const { x, y } = <Point>(this._center || {});

        // console.log(`isStart= ${isStart&& '是'}, isEnd= ${isEnd&& '是'}, ${eventType},${pointLength},${changedPointLength} ,x: ${x} ,y: ${y}`);

        return {
            ...BASE_INPUT,
            preventDefault: () => {
                event.preventDefault();
            },
            isStart,
            isEnd,
            pointLength,
            changedPointLength,
            center: this._center,
            x, y,
            timestamp,
            target,
            currentTarget,
            nativeEvent: event
        };
    };
}