let prevPointers: { clientX: number, clientY: number }[];
let isPressed = false;
// 默认MouseEvent中对type声明仅为string
export default (event: MouseEvent): {
    inputStatus: string,
    changedPointers: { clientX: number, clientY: number }[],
    pointers: { clientX: number, clientY: number }[],
    nativeEvent: Event
} | void => {
    const { clientX, clientY, type } = event;
    
    // changedPointers = prevPointers其实并不能完全等于touch下的changedPointers
    // 但是由于鼠标没有多点输入的需求, 
    // 所以暂时如此实现
    const changedPointers = prevPointers || [{ clientX, clientY }];
    // console.log(prevPointers, [{ clientX, clientY }],changedPointers);

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