"use strict";
exports.__esModule = true;
var vector_1 = require("../vector");
function default_1(_a) {
    var startV = _a.startV, prevV = _a.prevV, activeV = _a.activeV;
    var deltaAngle = vector_1.getAngle(activeV, prevV);
    var angle = vector_1.getAngle(activeV, startV);
    return { angle: angle, deltaAngle: deltaAngle };
}
exports["default"] = default_1;
;
//# sourceMappingURL=computeAngle.js.map