"use strict";
exports.__esModule = true;
var prevPointers = undefined;
var isPressed = false;
exports["default"] = (function (event) {
    var clientX = event.clientX, clientY = event.clientY, type = event.type;
    var changedPointers = prevPointers;
    var pointers = [{ clientX: clientX, clientY: clientY }];
    prevPointers = [{ clientX: clientX, clientY: clientY }];
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
    var MAP = {
        mousedown: 'start',
        mousemove: 'move',
        mouseup: 'end'
    };
    return {
        inputStatus: MAP[type],
        changedPointers: changedPointers,
        pointers: pointers,
        nativeEvent: event
    };
});
//# sourceMappingURL=mouse.js.map