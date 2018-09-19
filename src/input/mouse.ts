let prevPointers: any[] = undefined;
let isPressed = false;
export default function (event: any): any {
    const { clientX, clientY, type } = event;
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
        source: 'mouse',
        status: MAP[type],
        changedPointers,
        pointers,
        pointerLength: length,
        sourceEvent: event,
        stopPropagation: event.stopPropagation,
        preventDefault: event.preventDefault,
        stopImmediatePropagation: event.stopImmediatePropagation,
        target: event.target,
        currentTarget: event.currentTarget
    }
}; 