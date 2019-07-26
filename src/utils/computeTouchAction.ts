export default (touchActions: string[]): string => {
    // 表示优先级
    const TOUCH_ACTION_PRIORITY: { [propName: string]: number } = {
        auto: 0,
        manipulation: 1,
        'pan-x': 2,
        'pan-y': 2,
        none: 3
    };

    // 最大优先级
    const MAX_PRIORITY = TOUCH_ACTION_PRIORITY['none'];

    // 最终的有效的touch-action会放在数组中
    let touchActionCSSArray: string[] = ['auto'];
    // 上一步计算的touch-action的优先级
    let prevPriority = 0;
    for (let touchAction of touchActions) {

        // 当前优先级
        let activePriority = TOUCH_ACTION_PRIORITY[touchAction];

        // 如果是最大优先级, 那么后面就不用计算了
        if (MAX_PRIORITY === activePriority) {
            touchActionCSSArray = [touchAction];
            break;
        }
        // 当前优先级大, 那么覆盖touch-action
        else if (prevPriority < activePriority) {
            touchActionCSSArray = [touchAction];
            prevPriority = activePriority;
        }
        // 如果相等那么加入当前touch-action, 例如pan-x/pan-y可以并存
        else if (prevPriority === activePriority && 0 < activePriority) {
            touchActionCSSArray.push(touchAction);
            prevPriority = activePriority;
        }
        
    }
    return touchActionCSSArray.join(' ');
};