import sleep from './sleep';
import differenceWith from 'lodash/differenceWith';
import isEqual from 'lodash/isEqual';


interface Pointer {
    x: number;
    y: number;
};
interface Options {
    device: 'touch' | 'mouse';
};
const CLIENT_X = 'clientX';
const CLIENT_Y = 'clientY';
export default class TouchSimulator {
    public prevTouches: {
        clientX: number;
        clientY: number;
    }[];

    public el: Element | Document;
    public device: 'touch' | 'mouse';

    constructor(el: Element | Document, { device = 'touch' }: Options = <Options>{}) {
        this.el = el;
        this.device = device;
        this.prevTouches = [];
    };


    /**
     * 模拟touchstart
     * @param {ELement} dom元素
     * @param {Pointer[]} 触点
     */
    public dispatchTouchStart(pointers: Pointer[]) {
        let type = 'touch' === this.device ? 'touchstart' : 'mousedown';
        let event: any = new Event(type, {});
        if ('touch' === this.device) {
            event.touches = pointers.map(({ x, y }) => ({ [CLIENT_X]: x, [CLIENT_Y]: y }));
            event.changedTouches = differenceWith(event.touches, this.prevTouches, isEqual);
        } else {
            event[CLIENT_X] = pointers[0].x;
            event[CLIENT_Y] = pointers[0].y;
            event.button = 0;
        }
        this.prevTouches = event.touches;
        this.el.dispatchEvent(event);
        return event;
    };

    /**
     * 模拟touchmove
     * @param {ELement} dom元素
     * @param {Pointer[]} 触点
     */
    public dispatchTouchMove(pointers: Pointer[]) {
        let type = 'touch' === this.device ? 'touchmove' : 'mousemove';
        let event: any = new Event(type, {});

        if ('touch' === this.device) {
            // 对应点不同就放进changedTouches;
            event.touches = pointers.map(({ x, y }) => ({ [CLIENT_X]: x, [CLIENT_Y]: y }));
            event.changedTouches = differenceWith(event.touches, this.prevTouches, isEqual);

            this.prevTouches = event.touches;
            this.el.dispatchEvent(event);
        } else {
            event[CLIENT_X] = pointers[0].x;
            event[CLIENT_Y] = pointers[0].y;
            window.dispatchEvent(event);
        }
        return event;
    };

    /**
     * 模拟touchend, 主要是从touchs中删除点, 语法模拟Array.splice
     * @param {ELement} dom元素
     * @param {Number} 删除点在touchs中的索引起始索引
     * @param {Number} 删除多少个点
     */
    public dispatchTouchEnd(pointerIndex = 0, pointerNumber?: number) {
        let type = 'touch' === this.device ? 'touchend' : 'mouseup';
        let event: any = new Event(type, {});
        if ('touch' === this.device) {
            event.changedTouches = this.prevTouches.splice(pointerIndex, pointerNumber);
            event.touches = this.prevTouches;
            this.prevTouches = event.touches;
            this.el.dispatchEvent(event);
        } else {
            window.dispatchEvent(event);
        }
        return event;
    };

    /**
     * 模拟touchcancel
     * @param dom元素 
     */
    public dispatchTouchCancel() {
        let event: any = new Event('touchcancel', {});
        event.changedTouches = differenceWith(event.touches, this.prevTouches, isEqual);
        event.touches = [];
        this.prevTouches = event.touches;
        this.el.dispatchEvent(event);
        return event;
    };
}
