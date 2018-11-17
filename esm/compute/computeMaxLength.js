"use strict";
exports.__esModule = true;
var maxLength = 0;
exports["default"] = (function (_a) {
    var pointerLength = _a.pointerLength, isFirst = _a.isFirst, isFinal = _a.isFinal;
    if (isFirst) {
        maxLength = pointerLength;
    }
    else {
        maxLength = Math.max(maxLength, pointerLength);
    }
    return maxLength;
});
//# sourceMappingURL=computeMaxLength.js.map