/**
 * event(Mouse|Touch) => BasicsInput => Input => Computed => AnyTouchEvent
 * 构造统一的Input格式
 */
import type { BasicsInput, InputOnlyHasCurrent, Input, Point } from '@any-touch/shared';
import { CLIENT_X, CLIENT_Y, STAGE} from '@any-touch/shared';
export default function () {
    let id = 0;
    let prevInput: InputOnlyHasCurrent | undefined;
    let activeInput: InputOnlyHasCurrent | undefined;
    let startInput: InputOnlyHasCurrent | undefined;
    let startMultiInput: InputOnlyHasCurrent | undefined;

    return function (basicsInput: BasicsInput): Input | void {
        prevInput = activeInput;
        // 从event中采集的数据
        if (void 0 !== basicsInput) {
            // const baseInput = { ...basicsInput, id };
            id = Number.MAX_SAFE_INTEGER > id ? ++id : 1

            const pureInput = extendInput(basicsInput, id);

            activeInput = pureInput;
            const { isStart, pointLength } = pureInput;
            if (isStart) {
                // 起点(单点|多点)
                startInput = pureInput;
                prevInput = void 0;
                // 起点(多点)
                if (1 < pointLength) {
                    startMultiInput = pureInput;
                } else {
                    // 如果出现了单点, 那么之前的多点起点记录失效
                    startMultiInput = void 0;
                }
            }
            return {
                ...pureInput,
                prevInput: prevInput,
                startMultiInput: startMultiInput,
                startInput: <InputOnlyHasCurrent>startInput
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


function extendInput(basicsInput: BasicsInput, id: number): Omit<Input, 'prevInput' | 'startInput' | 'startMultiInput'> {

    const { stage, points, changedPoints, nativeEvent } = basicsInput;
    const pointLength = points.length;
    const isStart = STAGE.START === stage;
    const isEnd = (STAGE.END === stage && 0 === pointLength) || STAGE.CANCEL === stage;
    // 当前时间
    const timestamp = Date.now();
    // 触点中心
    // !!! 注意 !!!
    // 1. 此处的x,y和Touch事件的touchs不同, x,y代表发生事件的坐标,
    // 所以即便是touchend, 也会有x,y, 方便后续的位移和速度等计算.
    // 2. changedPoints 最少有一个点
    const { x, y } = getCenter(points) || getCenter(changedPoints) as Point;
    const { currentTarget } = nativeEvent;

    return Object.assign(basicsInput, {
        id,
        // preventDefault: () => nativeEvent.preventDefault(),
        x, y,
        timestamp,
        isStart, isEnd,
        pointLength,
        currentTarget,
        // 触点距离指定元素左上角的偏移
        getOffset(el: HTMLElement = currentTarget as HTMLElement): { x: number, y: number } {
            const rect = el.getBoundingClientRect();
            return { x: x - Math.round(rect.left), y: y - Math.round(rect.top) };
        }
    })
}