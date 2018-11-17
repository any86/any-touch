"use strict";
exports.__esModule = true;
var const_1 = require("./const");
var round = Math.round;
var getVLength = function (v) {
    return Math.sqrt(v.x * v.x + v.y * v.y);
};
exports.getVLength = getVLength;
var getDotProduct = function (v1, v2) {
    return v1.x * v2.x + v1.y * v2.y;
};
exports.getDotProduct = getDotProduct;
var getRadian = function (v1, v2) {
    var mr = getVLength(v1) * getVLength(v2);
    if (mr === 0)
        return 0;
    var r = getDotProduct(v1, v2) / mr;
    if (r > 1)
        r = 1;
    return Math.acos(r);
};
exports.getRadian = getRadian;
var getCross = function (v1, v2) {
    return v1.x * v2.y - v2.x * v1.y;
};
exports.getCross = getCross;
var getAngle = function (v1, v2) {
    var angle = getRadian(v1, v2);
    if (getCross(v1, v2) > 0) {
        angle *= -1;
    }
    return angle * 180 / Math.PI;
};
exports.getAngle = getAngle;
var getCenter = function (points) {
    var pointLength = points.length;
    if (1 < pointLength) {
        var x = 0;
        var y = 0;
        var i = 0;
        while (i < pointLength) {
            x += points[i][const_1.propX];
            y += points[i][const_1.propY];
            i++;
        }
        return {
            x: round(x / pointLength),
            y: round(y / pointLength)
        };
    }
    else {
        return { x: round(points[0][const_1.propX]), y: round(points[0][const_1.propY]) };
    }
};
exports.getCenter = getCenter;
var getDirection = function (displacementX, displacementY) {
    if (displacementX === displacementY) {
        return 'none';
    }
    else if (Math.abs(displacementX) > Math.abs(displacementY)) {
        return 0 < displacementX ? 'right' : 'left';
    }
    else {
        return 0 < displacementY ? 'down' : 'up';
    }
};
exports.getDirection = getDirection;
//# sourceMappingURL=vector.js.map