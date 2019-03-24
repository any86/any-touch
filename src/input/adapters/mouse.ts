import { BaseInput, eventType } from '../../interface';
let prevPointers: { clientX: number, clientY: number }[];
let isPressed = false;
// 默认MouseEvent中对type声明仅为string
export default (event: MouseEvent): BaseInput | void => {
    let { clientX, clientY, type, button } = event;

    // changedPointers = prevPointers其实并不能完全等于touch下的changedPointers
    // 但是由于鼠标没有多点输入的需求, 
    // 所以暂时如此实现
    const changedPointers = prevPointers || [{ clientX, clientY }];

    let points = [{ clientX, clientY }];
    prevPointers = [{ clientX, clientY }];

    // 必须左键
    if ('mousedown' === type) {
        if (0 === button) {
            isPressed = true;
        } else {
            return;
        }
    }

    if ('mousemove' === type) {
        if (!isPressed) return;
        // 确保移动过程中, 一直按住的都是左键,
        // if(1 !== event.which) {
        //     type = 'mouseup'
        // }
    } else if ('mouseup' === type) {
        if (isPressed) {
            points = [];
        } else {
            return;
        };
        isPressed = false;
    }

    const MAP = {
        mousedown: 'start',
        mousemove: 'move',
        mouseup: 'end'
    };

    return {
        eventType: <eventType>MAP[<'mousedown' | 'mousemove' | 'mouseup'>type],
        changedPointers,
        points,
        nativeEvent: event
    };
}; 