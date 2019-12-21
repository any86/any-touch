/**
 * 构造统一的Input格式
 */
import { InputBase, Input, SupportEvent, Point } from '@types';
import Touch from './adapters/Touch';
import Mouse from './adapters/Mouse';
import Adapter from './adapters/Abstract';
import { MOUSE, TOUCH, CLIENT_X, CLIENT_Y, INPUT_START, INPUT_CANCEL, INPUT_END } from '@const'


export default class {
    public adapter: Adapter;
    public id: number;
    public prevInput?: InputBase;
    public activeInput?: InputBase;
    public startInput?: InputBase;
    public startMultiInput?: InputBase;



    constructor(sourceType: typeof MOUSE | typeof TOUCH) {
        const SOURCE = {
            [MOUSE]: Mouse,
            [TOUCH]: Touch
        }[sourceType];

        this.adapter = new SOURCE();
        this.id = 0;
    };

    public transform(event: SupportEvent): Input | void {
        this.prevInput = this.activeInput;
        // 从event中采集的数据
        const inputBaseWithoutId = this.adapter.load(event);
        if (void 0 !== inputBaseWithoutId) {
            const id = Number.MAX_SAFE_INTEGER > this.id ? ++this.id : 1
            const inputBase = { ...inputBaseWithoutId, id };
            this.activeInput = inputBase;
            const extended = extendInput(inputBase);
            const { isStart, pointLength } = extended;
            if (isStart) {
                // 起点(单点|多点)
                this.startInput = inputBase;
                this.prevInput = void 0;
                // 起点(多点)
                if (1 < pointLength) {
                    this.startMultiInput = inputBase;
                } else {
                    // 如果出现了单点, 那么之前的多点起点记录失效
                    this.startMultiInput = void 0;
                }
            }

            return {
                ...extended,
                prevInput: this.prevInput,
                startMultiInput: this.startMultiInput,
                startInput: this.startInput
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


function extendInput(inputBase: InputBase): Omit<Input, 'prev'> {
    const { inputType, points, changedPoints, nativeEvent } = inputBase;
    const pointLength = points.length;
    const isStart = INPUT_START === inputType;
    const isEnd = (INPUT_END === inputType && 0 === pointLength) || INPUT_CANCEL === inputType;
    // 当前时间
    const timestamp = Date.now();
    // 触点中心
    // !!! 注意 !!!
    // 1. 此处的x,y和Touch事件的touchs不同, x,y代表发生事件的坐标,
    // 所以即便是touchend, 也会有x,y, 方便后续的位移和速度等计算.
    // 2. changedPoints 最少有一个点
    const { x, y } = getCenter(points) || getCenter(changedPoints) as Point;
    const { target, currentTarget } = nativeEvent;

    return {
        ...inputBase,
        preventDefault: () => {
            nativeEvent.preventDefault();
        },
        x, y,
        timestamp,
        isStart, isEnd,
        pointLength,
        target,
        currentTarget,
    }
}