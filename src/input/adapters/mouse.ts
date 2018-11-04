let prevPointers: any[] = undefined;
let isPressed = false;
export default (event: MouseEvent): any => {
    const { clientX, clientY, type } = event;
    const changedPointers = prevPointers;
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

    const MAP: {
        [propName: string]: string;
    } = {
        mousedown: 'start',
        mousemove: 'move',
        mouseup: 'end'
    };

    return {
        // type: `input-${MAP[type]}`,
        inputStatus: MAP[type],
        changedPointers,
        pointers,
        nativeEvent: event
    };
}; 