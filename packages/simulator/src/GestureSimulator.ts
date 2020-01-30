interface Input {
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
    public index: number;

    constructor(el: Element | Document, { device = 'touch' }: Options = <Options>{}) {
        this.el = el;
        this.device = device;
        this.prevTouches = [];
        this.index = 1;
    };


    public input2Points(input: Input[]) {
        return input.map(({ x, y }: any) => ({ [CLIENT_X]: x, [CLIENT_Y]: y }));
    }

    /**
     * 模拟touchstart
     * @param {Input[]} 新增触点
     */
    public dispatchTouchStart(input: Input[]=[{x:0,y:0}]) {
        let type = 'touch' === this.device ? 'touchstart' : 'mousedown';
        let event: any = new Event(type, {bubbles:true,cancelable:true});
        if ('touch' === this.device) {
            event.touches = [...this.prevTouches, ...this.input2Points(input)];
            event.targetTouches = event.touches;
            event.changedTouches = this.input2Points(input);
            event.identifier = this.index++;
            this.prevTouches = event.touches;
        } else {
            event[CLIENT_X] = input[0].x;
            event[CLIENT_Y] = input[0].y;
            event.button = 0;
            const {clientX,clientY} = event;
            this.prevTouches = [{clientX,clientY}];
        }
        
        this.el.dispatchEvent(event);
        return event;
    };

    /**
     * 模拟touchmove
     * @param {ELement} dom元素
     * @param {Input[]} 触点
     */
    public dispatchTouchMove(input: Input[]) {
        const points = this.input2Points(input);
        let type = 'touch' === this.device ? 'touchmove' : 'mousemove';
        let event: any = new Event(type, {bubbles:true,cancelable:true});

        if ('touch' === this.device) {
            if(points.length !== this.prevTouches.length) {
                throw new Error(`dispatchTouchMove控制的点的数量必须和prevTouches中的点数量一致! ${points.length} : ${this.prevTouches.length}`)
            }
            // 对应点不同就放进changedTouches;
            event.touches = points;
            event.targetTouches = event.touches;
            event.changedTouches = this.prevTouches.filter((prevTouchItem: any, index: number) => {
                const isXChanged = prevTouchItem[CLIENT_X] != points[index][CLIENT_X];
                const hasChanged = isXChanged || (prevTouchItem[CLIENT_Y] != points[index][CLIENT_Y]);
                return hasChanged && points[index];
            });

            this.prevTouches = event.touches;
            this.el.dispatchEvent(event);
        } else {
            event[CLIENT_X] = points[0][CLIENT_X];
            event[CLIENT_Y] = points[0][CLIENT_Y];
            window.dispatchEvent(event);
            this.prevTouches = points;
            this.el.dispatchEvent(event);
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
        let event: any = new Event(type, {bubbles:true,cancelable:true});
        const { length } = this.prevTouches;
        const changePoints =  this.prevTouches.splice(pointerIndex, pointerNumber || length);
        if ('touch' === this.device) {
            event.changedTouches = changePoints;
            event.touches = this.prevTouches;
            event.targetTouches = event.touches;
            this.prevTouches = event.touches;
            this.el.dispatchEvent(event);
        } else {
            this.el.dispatchEvent(event);
            window.dispatchEvent(event);
        }
        return event;
    };

    /**
     * 模拟touchcancel
     * @param dom元素 
     */
    public dispatchTouchCancel() {
        if(void 0 === this.prevTouches){
            throw new Error('不能单独触发Cancel!');
        }
        let event: any = new Event('touchcancel', {bubbles:true,cancelable:true});
        event.changedTouches = this.prevTouches;
        event.touches = this.prevTouches;
        event.targetTouches = this.prevTouches;
        this.prevTouches = event.touches;
        this.el.dispatchEvent(event);
        return event;
    };
}
