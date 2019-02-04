let prevPointers: any[];
let isPressed = false;
// 默认MouseEvent中对type声明仅为string
export default (event: MouseEvent): {
    inputStatus: string,
    changedPointers: { clientX: number, clientY: number }[],
    pointers: { clientX: number, clientY: number }[],
    nativeEvent: Event
} | void => {
    const { clientX, clientY, type } = event;
    const changedPointers = prevPointers || [{ clientX, clientY }];
    let pointers = [{ clientX, clientY }];
    prevPointers = [{ clientX, clientY }];
    if ('mousedown' === type) {
        isPressed = true;
    } else if ('mousemove' === type) {
        if (!isPressed) return;
    } else if ('mouseup' === type) {
        if (isPressed) {
            pointers = [];
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
        inputStatus: MAP[<'mousedown' | 'mousemove' | 'mouseup'>type],
        changedPointers,
        pointers,
        nativeEvent: event
    };
}; 