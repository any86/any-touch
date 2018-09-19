let prevPointers: any[] = undefined;
let isPressed = false;
export default (event: MouseEvent): any => {
    const { clientX, clientY, type} = event;
    const changedPointers = prevPointers;
    let pointers = prevPointers = [{ clientX, clientY }];
    let length = 1;

    if ('mousedown' === type) {
        isPressed = true;
    } else if ('mousemove' === type) {
        if (!isPressed) return;
    } else if ('mouseup' === type) {
        if (isPressed) {
            pointers = [];
            length = 0;
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
        status: MAP[type],
        changedPointers,
        pointers,
        sourceEvent: event
    };
}; 