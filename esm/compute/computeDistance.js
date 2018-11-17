"use strict";
exports.__esModule = true;
var prevDisplacementX = 0;
var prevDisplacementY = 0;
var const_1 = require("../const");
var vector_1 = require("../vector");
function default_1(_a) {
    var startInput = _a.startInput, input = _a.input;
    var inputStatus = input.inputStatus;
    var round = Math.round, abs = Math.abs;
    var displacementX = 0;
    var displacementY = 0;
    if ('start' === inputStatus) {
        prevDisplacementX = prevDisplacementY = 0;
    }
    else if ('move' === inputStatus) {
        displacementX = round(input.pointers[0][const_1.propX] - startInput.pointers[0][const_1.propX]);
        displacementY = round(input.pointers[0][const_1.propY] - startInput.pointers[0][const_1.propY]);
        prevDisplacementX = displacementX;
        prevDisplacementY = displacementY;
    }
    else if ('end' === inputStatus) {
        displacementX = prevDisplacementX;
        displacementY = prevDisplacementY;
    }
    var distanceX = abs(displacementX);
    var distanceY = abs(displacementY);
    var distance = round(vector_1.getVLength({ x: distanceX, y: distanceY }));
    return {
        displacementX: displacementX, displacementY: displacementY, distanceX: distanceX, distanceY: distanceY, distance: distance
    };
}
exports["default"] = default_1;
;
//# sourceMappingURL=computeDistance.js.map