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
var const_1 = require("../const");
var vector_1 = require("../vector");
var touch_1 = __importDefault(require("./adapters/touch"));
var mouse_1 = __importDefault(require("./adapters/mouse"));
var centerX;
var centerY;
exports["default"] = (function (event) {
    var input = {};
    if (const_1.IS_MOBILE) {
        input = touch_1["default"](event);
    }
    else {
        input = mouse_1["default"](event);
        if (undefined === input) {
            return;
        }
    }
    var inputStatus = input.inputStatus, pointers = input.pointers, changedPointers = input.changedPointers;
    var pointerLength = pointers.length;
    var changedPointerLength = changedPointers.length;
    var isFirst = (const_1.INPUT_START === inputStatus) && (0 === changedPointerLength - pointerLength);
    var isFinal = (const_1.INPUT_END === inputStatus) && (0 === pointerLength);
    if (0 < pointerLength) {
        var _a = vector_1.getCenter(input.pointers), x = _a.x, y = _a.y;
        centerX = x;
        centerY = y;
    }
    var timestamp = Date.now();
    var target = event.target, currentTarget = event.currentTarget;
    var stopPropagation = function () {
        event.stopPropagation();
    };
    var preventDefault = function () {
        event.preventDefault();
    };
    var stopImmediatePropagation = function () {
        event.stopImmediatePropagation();
    };
    return __assign({}, input, { isFirst: isFirst,
        isFinal: isFinal,
        stopPropagation: stopPropagation,
        preventDefault: preventDefault,
        stopImmediatePropagation: stopImmediatePropagation,
        pointerLength: pointerLength,
        changedPointerLength: changedPointerLength,
        centerX: centerX,
        centerY: centerY,
        timestamp: timestamp,
        target: target,
        currentTarget: currentTarget, nativeEvent: event });
});
//# sourceMappingURL=create.js.map