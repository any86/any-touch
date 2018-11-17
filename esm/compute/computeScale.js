"use strict";
exports.__esModule = true;
var vector_1 = require("../vector");
function default_1(_a) {
    var startV = _a.startV, prevV = _a.prevV, activeV = _a.activeV;
    var deltaScale = vector_1.getVLength(activeV) / vector_1.getVLength(prevV);
    var scale = vector_1.getVLength(activeV) / vector_1.getVLength(startV);
    return { scale: scale, deltaScale: deltaScale };
}
exports["default"] = default_1;
;
//# sourceMappingURL=computeScale.js.map