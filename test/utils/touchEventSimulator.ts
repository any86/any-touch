interface Pointer {
    x: number;
    y: number;
};
const CLIENT_X = 'clientX';
const CLIENT_Y = 'clientY';
let prevTouches: {
    clientX: number;
    clientY: number;
}[];
/**
 * 模拟touchstart
 * @param {ELement} dom元素
 * @param {Pointer[]} 触点
 */
export function dispatchTouchStart(el: any, pointers: Pointer[]) {
    let event: any = new Event('touchstart', {});
    event.touches = pointers.map(({ x, y }) => ({ [CLIENT_X]: x, [CLIENT_Y]: y }));
    event.changedTouches = pointers.map(({ x, y }) => ({ [CLIENT_X]: x, [CLIENT_Y]: y }));
    prevTouches = event.touches;
    el.dispatchEvent(event);
}

/**
 * 模拟touchmove
 * @param {ELement} dom元素
 * @param {Pointer[]} 触点
 */
export function dispatchTouchMove(el: any, pointers: Pointer[]) {
    let event: any = new Event('touchmove', {});
    // 对应点不同就放进changedTouches;
    event.changedTouches = pointers.filter(({ x, y }, index) => {
        return (prevTouches[index][CLIENT_X] !== x || prevTouches[index][CLIENT_Y] !== y);
    });
    event.touches = pointers.map(({ x, y }) => ({ [CLIENT_X]: x, [CLIENT_Y]: y }));
    prevTouches = event.touches;
    el.dispatchEvent(event);
};

/**
 * 模拟touchend, 主要是从touchs中删除点, 语法模拟Array.splice
 * @param {ELement} dom元素
 * @param {Number} 删除点在touchs中的索引起始索引
 * @param {Number} 删除多少个点
 */
export function dispatchTouchEnd(el: any, pointerIndex?: number, pointerNumber?: number) {
    let event: any = new Event('touchend', {});
    event.changedTouches = prevTouches.splice(pointerIndex || 0, pointerNumber || prevTouches.length);
    // 当前的prevTouches已经是减去了变化点后的数组
    event.touches = prevTouches;
    el.dispatchEvent(event);
}
/**
 * 模拟touchcancel
 * @param dom元素 
 */
export function dispatchTouchCancel(el: any) {
    let event: any = new Event('touchcancel', {});
    event.changedTouches = [];
    event.touches = [];
    el.dispatchEvent(event);
}