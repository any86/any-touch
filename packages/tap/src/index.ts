import type { Point, Computed, RecognizerOptions, RecognizerFunction } from '@any-touch/shared';
import {
    RECOGNIZER_STATUS, STAGE
} from '@any-touch/shared';
import { getVLength } from '@any-touch/vector';
import { ComputeDistance, ComputeMaxLength } from '@any-touch/compute';
import createContext from '@any-touch/recognizer';
const DEFAULT_OPTIONS = {
    name: 'tap',
    // 触点数
    pointLength: 1,
    // 点击次数
    tapTimes: 1,
    // 等待下一次tap的时间, 
    // 超过该事件就立即判断当前点击数量
    waitNextTapTime: 300,

    // 从接触到离开允许产生的最大距离
    maxDistance: 2,
    // 2次tap之间允许的最大位移
    maxDistanceFromPrevTap: 9,
    // 从接触到离开屏幕的最大时间
    maxPressTime: 250,
};

export default function Tap(options?: RecognizerOptions<typeof DEFAULT_OPTIONS>): ReturnType<RecognizerFunction> {
    const _context = createContext(DEFAULT_OPTIONS, options);
    let _tapCount = 0;
    // 记录每次单击完成时的坐标
    let _prevTapPoint: Point | undefined;
    let _prevTapTime: number | undefined;
    let _countDownToFailTimer: number;
    
    /**
      * 识别条件
      * @param computed 计算结果
      * @return 是否验证成功
      */
    function _test(computed: Computed): boolean {
        const { startInput, pointLength } = computed;
        const deltaTime = computed.timestamp - startInput.timestamp;
        // 1. 触点数
        // 2. 当前点击数为0, 也就是当所有触点离开才通过
        // 3. 移动距离
        // 4. start至end的事件, 区分tap和press
        const { maxPointLength, distance } = computed;
        // console.log(this.name,pointLength, maxPointLength)
        return maxPointLength === _context.pointLength &&
            0 === pointLength &&
            _context.maxDistance >= distance &&
            _context.maxPressTime > deltaTime;
    };


    /**
     * 校验2次tap的时间间隔是否满足
     * @return {Boolean} 是否满足
     */
    function _isValidInterval(): boolean {
        const now = performance.now();
        if (void 0 === _prevTapTime) {
            _prevTapTime = now;
            return true;
        } else {
            const interval = now - _prevTapTime;
            _prevTapTime = now;
            return interval < _context.waitNextTapTime;
        }
    };

    /**
     * 指定时候后, 状态变为"失败"
     */
    function _countDownToFail() {
        _countDownToFailTimer = (setTimeout as Window['setTimeout'])(() => {
            _context.status = RECOGNIZER_STATUS.FAILED;
            _reset();
        }, _context.waitNextTapTime);
    };

    function _cancelCountDownToFail() {
        clearTimeout(_countDownToFailTimer);
    };

    function _reset() {
        _tapCount = 0;
        _prevTapPoint = void 0;
        _prevTapTime = void 0;
    };

    /**
    * 判断前后2次点击的距离是否超过阈值
    * @param center 当前触点中心坐标
    * @return 前后2次点击的距离是否超过阈值
    */
    function _isValidDistanceFromPrevTap(center: Point): boolean {
        // 判断2次点击的距离
        if (void 0 !== _prevTapPoint) {
            const distanceFromPreviousTap = getVLength({ x: center.x - _prevTapPoint.x, y: center.y - _prevTapPoint.y });
            // 缓存当前点, 作为下次点击的上一点
            _prevTapPoint = center;
            return _context.maxDistanceFromPrevTap >= distanceFromPreviousTap;
        } else {
            _prevTapPoint = center;
            return true;
        }
    };

    /**
     * 识别后执行, 流程如下:  
     *             开始   
     *              |
     *         <是否end阶段> - 否 - 结束
     *              |
     *          关闭定时器c1和c2
     *              |
     *          清除等待状态
     *              |
     *              是
     *              |
     *        重置状态为"可能是"
     *              |
     *        <是否满足单击条件> - 否 - 结束
     *              |
     *              是
     *              |
     *       <是否正确连击：是否上次点击信息为空 或 与上次点击的位移/时间是否满足约束> - 否 - 点击次数=1 - 继续(<是否到达点击数要求>)
     *              |
     *              是
     *              |
     *           点击次数+1
     *              |
     *       <是否到达点击数要求> - 否 - 设置定时器c1(t1毫秒后状态设置为"失败") - 结束
     *              |
     *              是
     *              |
     *      <是否需要其他手势失败> - 否 - 触发事件, 状态设置为"已识别",重置(点击次数,位置) - 结束
     *              |
     *              是
     *              |
     *           进入等待状态
     *              |
     *  <设置定时器c2(t1毫秒后检查"需要失败"的手势是否是"失败"状态, 重置(点击次数,位置, 等待状态)> - 否 - 设置状态为"失败" - 结束
     *              |
     *              是
     *              |
     *       触发, 状态设置为"已识别", 重置(点击次数,位置)
     *              |
     *             结束
     * 
     * @param computed 计算数据 
     * @param emit 事件触发器
     */
    function _recognize(
        computed: Computed,
        emit: (type: string, ...payload: any[]) => void
    ): void {
        const { stage, x, y } = computed;
        _context.status = RECOGNIZER_STATUS.POSSIBLE;
        // 只在end阶段去识别
        if (STAGE.END !== stage) return;

        // 每一次点击是否符合要求
        if (_test(computed)) {

            _cancelCountDownToFail();
            // 判断2次点击之间的距离是否过大
            // 对符合要求的点击进行累加
            if (_isValidDistanceFromPrevTap({ x, y }) && _isValidInterval()) {
                _tapCount++;
            } else {
                _tapCount = 1;
            }

            // 是否满足点击次数要求
            // 之所以用%, 是因为如果连续点击3次, 单击的tapCount会为3, 但是其实tap也应该触发
            if (0 === _tapCount % _context.tapTimes) {
                _context.status = RECOGNIZER_STATUS.RECOGNIZED;
                emit(_context.name, { ...computed, tapCount: _tapCount });
                _reset();
            } else {
                _countDownToFail();
            }
        } else {
            _reset();
            _context.status = RECOGNIZER_STATUS.FAILED;
        }
    };

    return [_context, _recognize];
}
Tap.C = [ComputeDistance, ComputeMaxLength];