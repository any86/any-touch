"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var vector_1 = require("../vector");
var computeLast_1 = __importDefault(require("./computeLast"));
var computeDistance_1 = __importDefault(require("./computeDistance"));
var computeDeltaXY_1 = __importDefault(require("./computeDeltaXY"));
var computeVector_1 = __importDefault(require("./computeVector"));
var computeScale_1 = __importDefault(require("./computeScale"));
var computeAngle_1 = __importDefault(require("./computeAngle"));
var computeMaxLength_1 = __importDefault(require("./computeMaxLength"));
function default_1(_a) {
    var startInput = _a.startInput, prevInput = _a.prevInput, startMutliInput = _a.startMutliInput, input = _a.input;
    if (undefined === input)
        return;
    var abs = Math.abs, max = Math.max;
    var computed = {
        pointers: [],
        changedPointers: [],
        pointerLength: input.pointerLength,
        changedPointerLength: input.changedPointerLength,
        displacementX: 0,
        displacementY: 0,
        distanceX: 0,
        distanceY: 0,
        distance: 0,
        direction: 'none',
        lastDirection: 'none',
        deltaX: undefined,
        deltaY: undefined,
        velocityX: 0,
        velocityY: 0,
        maxVelocity: 0,
        duration: 0,
        timestamp: Date.now(),
        angle: 0,
        deltaAngle: 0,
        scale: 1,
        deltaScale: 1,
        lastVelocity: undefined,
        lastVelocityY: undefined,
        lastVelocityX: undefined
    };
    var _b = computeDistance_1["default"]({
        startInput: startInput,
        input: input
    }), displacementX = _b.displacementX, displacementY = _b.displacementY, distanceX = _b.distanceX, distanceY = _b.distanceY, distance = _b.distance;
    computed = __assign({}, computed, { displacementX: displacementX, displacementY: displacementY, distanceX: distanceX, distanceY: distanceY, distance: distance });
    computed.direction = vector_1.getDirection(displacementX, displacementY);
    computed.duration = input.timestamp - startInput.timestamp;
    var lastComputed = computeLast_1["default"](input);
    computed.lastVelocityX = lastComputed.velocityX;
    computed.lastVelocityY = lastComputed.velocityY;
    computed.lastVelocity = lastComputed.velocity;
    computed.lastDirection = lastComputed.direction;
    var _c = computeDeltaXY_1["default"]({ input: input, prevInput: prevInput }), deltaX = _c.deltaX, deltaY = _c.deltaY;
    computed.deltaX = deltaX;
    computed.deltaY = deltaY;
    if (undefined !== prevInput) {
        computed.deltaTime = input.timestamp - prevInput.timestamp;
    }
    else {
        computed.deltaTime = 0;
    }
    computed.velocityX = abs(computed.distanceX / computed.duration) || 0;
    computed.velocityY = abs(computed.distanceY / computed.duration) || 0;
    computed.maxVelocity = max(computed.velocityX, computed.velocityY);
    if (undefined !== prevInput && 1 < prevInput.pointers.length && 1 < input.pointers.length) {
        var startV = computeVector_1["default"](startMutliInput);
        var prevV = computeVector_1["default"](prevInput);
        var activeV = computeVector_1["default"](input);
        var _d = computeScale_1["default"]({
            startV: startV, activeV: activeV, prevV: prevV
        }), deltaScale = _d.deltaScale, scale = _d.scale;
        computed.scale = scale;
        computed.deltaScale = deltaScale;
        var _e = computeAngle_1["default"]({ startV: startV, prevV: prevV, activeV: activeV }), angle = _e.angle, deltaAngle = _e.deltaAngle;
        computed.angle = angle;
        computed.deltaAngle = deltaAngle;
    }
    var maxPointerLength = computeMaxLength_1["default"](input);
    return __assign({}, input, { maxPointerLength: maxPointerLength }, computed);
}
exports["default"] = default_1;
;
//# sourceMappingURL=index.js.map