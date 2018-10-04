/**
 * 构造统一的touchEvent格式
 */
import { nativeEventType } from '../interface';
import { propX, propY, SUPPORT_ONLY_TOUCH } from '../const';
import { getCenter } from '../vector';
import touchInput from './adapters/touch'
import mouseInput from './adapters/mouse';

let centerX: number;
let centerY: number;
export default class Input {
    // start | move | end | cancel
    public nativeEventType: nativeEventType;
    public pointers: any[] = [];
    public timestamp: number;
    public target: EventTarget;
    public currentTarget: EventTarget;
    public centerX: number;
    public centerY: number;
    public stopPropagation: () => void;
    public preventDefault: () => void;
    public stopImmediatePropagation: () => void;
    public nativeEvent: any;

    constructor(event: any) {
        let input: Input;
        // Touch
        if (SUPPORT_ONLY_TOUCH) {
            input = touchInput(event);
        }
        // Mouse
        else {
            input = mouseInput(event);
            if (undefined === input) return;
        }

        // 当前触点数
        const pointerLength: number = input.pointers.length;

        // pointers只存储clientX/Y就够了
        for (let i = 0; i < pointerLength; i++) {
            let pointer = input.pointers[i];
            this.pointers[i] = {
                [propX]: Math.round(pointer[propX]),
                [propY]: Math.round(pointer[propY])
            };
        }
        // 中心坐标
        // let centerX: number;
        // let centerY: number;
        if (0 < pointerLength) {
            const center = getCenter(this.pointers);
            centerX = center.x;
            centerY = center.y;
        }
        // 当前时间
        const timestamp = Date.now();
        // 原生属性/方法
        const { stopPropagation, preventDefault, stopImmediatePropagation, target, currentTarget } = event;
        // mixin
        Object.assign(this, input, { pointerLength, centerX, centerY, timestamp, stopPropagation, preventDefault, stopImmediatePropagation, target, currentTarget, nativeEvent: event });
    }
}