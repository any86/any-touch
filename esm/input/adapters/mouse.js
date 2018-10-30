let prevPointers = undefined;
let isPressed = false;
export default (event) => {
    const { clientX, clientY, type } = event;
    const changedPointers = prevPointers;
    let pointers = [{ clientX, clientY }];
    prevPointers = [{ clientX, clientY }];
    if ('mousedown' === type) {
        isPressed = true;
    }
    else if ('mousemove' === type) {
        if (!isPressed)
            return;
    }
    else if ('mouseup' === type) {
        if (isPressed) {
            pointers = [];
        }
        else {
            return;
        }
        ;
        isPressed = false;
    }
    const MAP = {
        mousedown: 'start',
        mousemove: 'move',
        mouseup: 'end'
    };
    return {
        nativeEventType: MAP[type],
        changedPointers,
        pointers,
        nativeEvent: event
    };
};
