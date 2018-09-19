/**
 * 构造统一的touchEvent格式
 */
import { propX, propY, SUPPORT_ONLY_TOUCH } from '../const';
import { getCenter } from '../vector';
import touchInput from '../input/touch'
import mouseInput from '../input/mouse';
export default class Input {
    // start | move | end | cancel
    public status: string;
    public pointers: any[] = [];
    public pointerLength: number = 0;
    public timestamp: number;
    public target: EventTarget;
    public center: { x: number, y: number };

    constructor(event: any) {

        let pointers: any;
        let pointerLength: number = 0;

        // Touch
        if (SUPPORT_ONLY_TOUCH) {
            const input = touchInput(event);
            pointers = input.pointers;
            this.status = input.status;
        }

        // Mouse
        else {
            const input = mouseInput(event);
            if (undefined === input) return;
            pointers = input.pointers;
            this.status = input.status;
        }

        // 当前触点数
        pointerLength = pointers.length;
        for (let i = 0; i < pointerLength; i++) {
            let pointer = pointers[i];
            this.pointers[i] = {
                [propX]: Math.round(pointer[propX]),
                [propY]: Math.round(pointer[propY])
            };
        }

        
        this.center = 0 < pointerLength ? getCenter(pointers) : undefined;
        this.timestamp = Date.now();
        this.target = event.target;
        this.pointerLength = pointerLength;
    }
}