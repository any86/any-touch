interface Pointer {
    x: number;
    y: number;
};
const CLIENT_X = 'clientX';
const CLIENT_Y = 'clientY';
export default class TouchSimulator {
    public prevTouches: {
        clientX: number;
        clientY: number;
    }[];

    public el: Element | Document;

    constructor(el: Element | Document) {
        this.el = el;
    };

    /**
     * 模拟touchstart
     * @param {ELement} dom元素
     * @param {Pointer[]} 触点
     */
    public dispatchTouchStart(pointers: Pointer[]) {
        let event: any = new Event('touchstart', {});
        event.touches = pointers.map(({ x, y }) => ({ [CLIENT_X]: x, [CLIENT_Y]: y }));
        event.changedTouches = pointers.map(({ x, y }) => ({ [CLIENT_X]: x, [CLIENT_Y]: y }));
        this.prevTouches = event.touches;
        this.el.dispatchEvent(event);
    };

    /**
     * 模拟touchmove
     * @param {ELement} dom元素
     * @param {Pointer[]} 触点
     */
    public dispatchTouchMove(pointers: Pointer[]) {
        let event: any = new Event('touchmove', {});
        // 对应点不同就放进changedTouches;
        event.changedTouches = pointers.filter(({ x, y }, index) => {
            return (this.prevTouches[index][CLIENT_X] !== x || this.prevTouches[index][CLIENT_Y] !== y);
        });
        event.touches = pointers.map(({ x, y }) => ({ [CLIENT_X]: x, [CLIENT_Y]: y }));
        this.prevTouches = event.touches;
        this.el.dispatchEvent(event);
    };

    /**
     * 模拟touchend, 主要是从touchs中删除点, 语法模拟Array.splice
     * @param {ELement} dom元素
     * @param {Number} 删除点在touchs中的索引起始索引
     * @param {Number} 删除多少个点
     */
    public dispatchTouchEnd(pointerIndex?: number, pointerNumber?: number) {
        let event: any = new Event('touchend', {});
        event.changedTouches = this.prevTouches.splice(pointerIndex || 0, pointerNumber || this.prevTouches.length);
        // 当前的this.prevTouches已经是减去了变化点后的数组
        event.touches = this.prevTouches;
        this.el.dispatchEvent(event);
    };

    /**
     * 模拟touchcancel
     * @param dom元素 
     */
    public dispatchTouchCancel() {
        let event: any = new Event('touchcancel', {});
        event.changedTouches = [];
        event.touches = [];
        this.el.dispatchEvent(event);
    };
}
