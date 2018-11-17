"use strict";
exports.__esModule = true;
exports["default"] = (function (event) {
    var pointers = event.touches;
    var changedPointers = event.changedTouches;
    var inputStatus = event.type.replace('touch', '');
    return {
        inputStatus: inputStatus,
        changedPointers: changedPointers,
        pointers: pointers,
        nativeEvent: event
    };
});
//# sourceMappingURL=touch.js.map