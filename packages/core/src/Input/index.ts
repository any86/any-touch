/**
 * 构造统一的Input格式
 */
import { BaseInput, PureInput, Input, SupportEvent, Point } from '@any-touch/shared';
import Touch from './adapters/Touch';
import Mouse from './adapters/Mouse';
import Adapter from './adapters/Abstract';
import { SUPPORT_TOUCH, CLIENT_X, CLIENT_Y, INPUT_START, INPUT_CANCEL, INPUT_END } from '@any-touch/shared';
export default class {
    public adapter: Adapter;
    public id: number;
    public prevInput?: PureInput;
    public activeInput?: PureInput;
    public startInput?: PureInput;
    public startMultiInput?: PureInput;
    public el?:HTMLElement;
    constructor(el?:HTMLElement) {
        const Input = SUPPORT_TOUCH ? Touch : Mouse;
        this.adapter = new Input();
        this.id = 0;
        this.el = el;
    };

    public transform(event: SupportEvent): Input | void {

        this.prevInput = this.activeInput;
        // 从event中采集的数据
        const baseInputWithoutId = this.adapter.load(event,this.el);
        if (void 0 !== baseInputWithoutId) {
            // 过滤第一个点非绑定元素, 但是第二个触点是绑定元素的情况
            // 不然会错误的触发pinch/rotate等多指操作
            // !!!后续考虑是否仅仅排除错误的触点, 而保留本次事件部分数据
            // if (hasTouchTargetOutOfCurrentTarget(baseInputWithoutId)) return;

            const id = Number.MAX_SAFE_INTEGER > this.id ? ++this.id : 1
            const baseInput = { ...baseInputWithoutId, id };

            const pureInput = extendInput(baseInput);

            this.activeInput = pureInput;
            const { isStart, pointLength } = pureInput;
            if (isStart) {
                // 起点(单点|多点)
                this.startInput = pureInput;
                this.prevInput = void 0;
                // 起点(多点)
                if (1 < pointLength) {
                    this.startMultiInput = pureInput;
                } else {
                    // 如果出现了单点, 那么之前的多点起点记录失效
                    this.startMultiInput = void 0;
                }
            }
            return {
                ...pureInput,
                prevInput: this.prevInput,
                startMultiInput: this.startMultiInput,
                startInput: <PureInput>this.startInput
            }
        };
    }
}
/**
 * 获取多点之间的中心坐标
 * @param {Array} 触碰点
 */
function getCenter(points: { clientX: number, clientY: number }[]): Point | void {
    const { length } = points;
    if (0 < length) {
        // 只有一个点
        if (1 === length) {
            const { clientX, clientY } = points[0];
            return { x: Math.round(clientX), y: Math.round(clientY) };
        }

        const countPoint = points.reduce((countPoint: Point, point: { clientX: number, clientY: number }) => {
            countPoint.x += point[CLIENT_X];
            countPoint.y += point[CLIENT_Y];
            return countPoint;
        }, { x: 0, y: 0 });
        return { x: Math.round(countPoint.x / length), y: Math.round(countPoint.y / length) }
    }
};


function extendInput(inputBase: BaseInput): Omit<Input, 'prevInput' | 'startInput' | 'startMultiInput'> {
    const { inputType, points, changedPoints, nativeEvent } = inputBase;
    const pointLength = points.length;
    const isStart = INPUT_START === inputType;
    const isEnd = (INPUT_END === inputType && 0 === pointLength) || INPUT_CANCEL === inputType;
    // 当前时间
    const timestamp = performance.now();
    // 触点中心
    // !!! 注意 !!!
    // 1. 此处的x,y和Touch事件的touchs不同, x,y代表发生事件的坐标,
    // 所以即便是touchend, 也会有x,y, 方便后续的位移和速度等计算.
    // 2. changedPoints 最少有一个点
    const { x, y } = getCenter(points) || getCenter(changedPoints) as Point;
    const { currentTarget } = nativeEvent;

    return {
        ...inputBase,
        // preventDefault: () => nativeEvent.preventDefault(),
        x, y,
        timestamp,
        isStart, isEnd,
        pointLength,
        currentTarget,
        // 触点距离指定元素左上角的偏移
        getOffset(el: HTMLElement | SVGElement = currentTarget as HTMLElement): { x: number, y: number } {
            const rect = el.getBoundingClientRect();
            // console.log(rect,x,y);
            return { x: x - Math.round(rect.left), y: y - Math.round(rect.top) };
        }
    }
}

/**
 * 是否每个触点的target都是currentTarget的子元素
 * 过滤第一个点非绑定元素, 但是第二个触点是绑定元素的情况
 * @param baseInputWithoutId 输入
 */
// function hasTouchTargetOutOfCurrentTarget(baseInputWithoutId: Omit<BaseInput, 'id'>): boolean {
//     let isOutOfCurrentTarget = false;
//     const { currentTarget } = baseInputWithoutId.nativeEvent;
//     // 在运行阶段应该不会出现 null === currentTarget, 此处判断有待商榷是否删除
//     if (window !== currentTarget
//         && document !== currentTarget
//         && null !== currentTarget) {
//         baseInputWithoutId.points.forEach(({ target }) => {
//             if (!(currentTarget as HTMLElement).contains(target as HTMLElement)) {
//                 // console.log('out')
//                 isOutOfCurrentTarget = true;
//             }
//         });
//     }
//     return isOutOfCurrentTarget;
// }