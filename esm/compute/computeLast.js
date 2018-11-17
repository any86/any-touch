"use strict";
exports.__esModule = true;
var const_1 = require("../const");
var vector_1 = require("../vector");
var _prevInput;
var _prevVelocityX;
var _prevVelocityY;
var _prevDirection;
exports["default"] = (function (input) {
    var velocityX;
    var velocityY;
    var direction;
    _prevInput = _prevInput || input;
    var deltaTime = input.timestamp - _prevInput.timestamp;
    var deltaX = (0 < input.centerX) ? input.centerX - _prevInput.centerX : 0;
    var deltaY = (0 < input.centerY) ? input.centerY - _prevInput.centerY : 0;
    if (const_1.COMPUTE_INTERVAL < deltaTime) {
        velocityX = Math.abs(deltaX / deltaTime);
        velocityY = Math.abs(deltaY / deltaTime);
        direction = vector_1.getDirection(deltaX, deltaY);
        _prevVelocityX = velocityX;
        _prevVelocityY = velocityY;
        _prevDirection = direction;
        _prevInput = input;
    }
    else {
        velocityX = _prevVelocityX || 0;
        velocityY = _prevVelocityY || 0;
        direction = _prevDirection || 'none';
    }
    var maxVelocity = Math.max(velocityX, velocityY);
    return { velocity: maxVelocity, velocityX: velocityX, velocityY: velocityY, direction: direction };
});
//# sourceMappingURL=computeLast.js.map