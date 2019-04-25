/**
 * 构造统一的Input格式
 */
import { Input, Point } from '../interface';
import { SUPPORT_TOUCH, INPUT_END, INPUT_START, INPUT_CANCEL } from '../const';
import { getCenter } from '../vector';
import Touch from './adapters/Touch';
import Mouse from './adapters/mouse';

export default class {
    // 缓存触点中心
    private _center?: Point;
    public adapter: any;
    constructor() {
        this.adapter = SUPPORT_TOUCH ? new Touch() : new Mouse();
    };

    public load(event: Event): Input | void {
        // 通过TouchEvent|MouseEvent获取的直接数据
        let baseInput = this.adapter.load(event);
        if (undefined === baseInput) {
            return;
        }
        const { eventType, points, changedPoints } = baseInput;
        // 当前触点数
        const pointLength: number = points.length;

        // 变化前触点数
        const changedPointLength: number = changedPoints.length;
        // 识别流程的开始和结束标记
        const isFirst = (INPUT_START === eventType) && (0 === changedPointLength - pointLength);
        // 所有触点都离开算作"final", 这和hammer.js不一样
        const isFinal = (INPUT_END === eventType || INPUT_CANCEL === eventType) && (0 === pointLength);

        // 中心坐标
        if (0 < pointLength) {
            this._center = getCenter(baseInput.points);
        }

        // 当前时间
        const timestamp = Date.now();

        // 原生属性/方法
        const { target, currentTarget } = event;
        const { x, y } = <Point>(this._center || {});
        return {
            ...baseInput,
            preventDefault: () => {
                event.preventDefault();
            },
            isFirst,
            isFinal,
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