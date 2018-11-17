"use strict";
exports.__esModule = true;
function default_1(_a) {
    var prevInput = _a.prevInput, input = _a.input;
    var deltaX;
    var deltaY;
    if ('end' === input.inputStatus || 'start' === input.inputStatus) {
        deltaX = 0;
        deltaY = 0;
    }
    else {
        deltaX = input.centerX - prevInput.centerX;
        deltaY = input.centerY - prevInput.centerY;
    }
    return { deltaX: deltaX, deltaY: deltaY };
}
exports["default"] = default_1;
;
//# sourceMappingURL=computeDeltaXY.js.map