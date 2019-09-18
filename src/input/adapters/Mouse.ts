import { BaseInput, eventType } from '../../interface';
// 默认MouseEvent中对type声明仅为string
import Adapter from './Abstract';

import { INPUT_START,INPUT_MOVE,INPUT_END } from '../../const';

export default class extends Adapter {
    prevPoints?: { clientX: number, clientY: number }[];
    isPressed: boolean;
    constructor() {
        super();
        this.isPressed = false;
    };

    load(event: MouseEvent): BaseInput | void {
        let { clientX, clientY, type, button } = event;

        // changedPoints = prevPoints其实并不能完全等于touch下的changedPoints
        // 但是由于鼠标没有多点输入的需求, 
        // 所以暂时如此实现
        const changedPoints = this.prevPoints || [{ clientX, clientY }];

        let points = [{ clientX, clientY }];
        this.prevPoints = [{ clientX, clientY }];

        // 必须左键
        if ('mousedown' === type) {
            if (0 === button) {
                this.isPressed = true;
            } else {
                return;
            }
        }

        if ('mousemove' === type) {
            if (!this.isPressed) return;
            // 确保移动过程中, 一直按住的都是左键,
            // if(1 !== event.which) {
            //     type = 'mouseup'
            // }
        } else if ('mouseup' === type) {
            if (this.isPressed) {
                points = [];
            } else {
                return;
            };
            this.isPressed = false;
        }

        const MAP = {
            mousedown: INPUT_START,
            mousemove: INPUT_MOVE,
            mouseup: INPUT_END
        };

        return {
            eventType: <eventType>MAP[<'mousedown' | 'mousemove' | 'mouseup'>type],
            changedPoints,
            points,
            nativeEvent: event
        };
    }
}; 