import { BaseInput, eventType } from '@types';
import Adapter from './Abstract';
export default class extends Adapter {
    prevPoints?: { clientX: number, clientY: number }[];
    isPressed: boolean;
    constructor() {
        super();
        this.isPressed = false;
    };
    load(event: MouseEvent): Omit<BaseInput,'id'> | void {
        const { clientX, clientY, type, button } = event;
        let points = [{ clientX, clientY }];
        let eventType: eventType | undefined;
        if ('mousedown' === type && 0 === button) {
            // 必须左键
            this.isPressed = true;
            eventType = 'start';
        } else if (this.isPressed) {
            if ('mousemove' === type) {
                eventType = 'move';
            } else if ('mouseup' === type) {
                points = [];
                eventType = 'end';
                this.isPressed = false;
            }
        }

        // changedPoints = prevPoints其实并不能完全等于touch下的changedPoints
        // 但是由于鼠标没有多点输入的需求, 
        // 所以暂时如此实现
        const changedPoints = this.prevPoints || [{ clientX, clientY }];

        this.prevPoints = [{ clientX, clientY }];

        if (void 0 !== eventType) {
            return {
                eventType,
                changedPoints,
                points,
                nativeEvent: event
            };
        }

    }
}; 