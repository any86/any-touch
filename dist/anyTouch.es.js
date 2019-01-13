/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
}

function __values(o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
}

function __read(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
}

function __spread() {
    for (var ar = [], i = 0; i < arguments.length; i++)
        ar = ar.concat(__read(arguments[i]));
    return ar;
}

var MOBILE_REGEX = /mobile|tablet|ip(ad|hone|od)|android/i;
var IS_MOBILE = MOBILE_REGEX.test(navigator.userAgent);
var SUPPORT_TOUCH = ('ontouchstart' in window);
var SUPPORT_ONLY_TOUCH = SUPPORT_TOUCH && MOBILE_REGEX.test(navigator.userAgent);
var COMPUTE_INTERVAL = 25;
var propX = 'clientX';
var propY = 'clientY';
var INPUT_START = 'start';
var INPUT_MOVE = 'move';
var INPUT_CANCEL = 'cancel';
var INPUT_END = 'end';
//# sourceMappingURL=const.js.map

var round = Math.round;
var getVLength = function (v) {
    return Math.sqrt(v.x * v.x + v.y * v.y);
};
var getDotProduct = function (v1, v2) {
    return v1.x * v2.x + v1.y * v2.y;
};
var getRadian = function (v1, v2) {
    var mr = getVLength(v1) * getVLength(v2);
    if (mr === 0)
        return 0;
    var r = getDotProduct(v1, v2) / mr;
    if (r > 1)
        r = 1;
    return Math.acos(r);
};
var getCross = function (v1, v2) {
    return v1.x * v2.y - v2.x * v1.y;
};
var getAngle = function (v1, v2) {
    var angle = getRadian(v1, v2);
    if (getCross(v1, v2) > 0) {
        angle *= -1;
    }
    return angle * 180 / Math.PI;
};
var getCenter = function (points) {
    var pointLength = points.length;
    if (1 < pointLength) {
        var x = 0;
        var y = 0;
        var i = 0;
        while (i < pointLength) {
            x += points[i][propX];
            y += points[i][propY];
            i++;
        }
        return {
            x: round(x / pointLength),
            y: round(y / pointLength)
        };
    }
    else {
        return { x: round(points[0][propX]), y: round(points[0][propY]) };
    }
};
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
//# sourceMappingURL=vector.js.map

var touchAdapter = (function (event) {
    var pointers = Array.from(event.touches).map(function (_a) {
        var clientX = _a.clientX, clientY = _a.clientY;
        return ({ clientX: clientX, clientY: clientY });
    });
    var changedPointers = Array.from(event.changedTouches).map(function (_a) {
        var clientX = _a.clientX, clientY = _a.clientY;
        return ({ clientX: clientX, clientY: clientY });
    });
    var inputStatus = event.type.replace('touch', '');
    return {
        inputStatus: inputStatus,
        changedPointers: changedPointers,
        pointers: pointers,
        nativeEvent: event
    };
});
//# sourceMappingURL=touch.js.map

var prevPointers = undefined;
var isPressed = false;
var mouseAdapter = (function (event) {
    var clientX = event.clientX, clientY = event.clientY, type = event.type;
    var changedPointers = prevPointers;
    var pointers = [{ clientX: clientX, clientY: clientY }];
    prevPointers = [{ clientX: clientX, clientY: clientY }];
    if ('mousedown' === type) {
        isPressed = true;
    }
    else if ('mousemove' === type) {
        if (!isPressed)
            return;
    }
    else if ('mouseup' === type) {
        if (isPressed) {
            pointers = [];
        }
        else {
            return;
        }
        isPressed = false;
    }
    var MAP = {
        mousedown: 'start',
        mousemove: 'move',
        mouseup: 'end'
    };
    return {
        inputStatus: MAP[type],
        changedPointers: changedPointers,
        pointers: pointers,
        nativeEvent: event
    };
});
//# sourceMappingURL=mouse.js.map

var centerX;
var centerY;
var createInput = (function (event) {
    var input = {};
    if (IS_MOBILE) {
        input = touchAdapter(event);
    }
    else {
        input = mouseAdapter(event);
        if (undefined === input) {
            return;
        }
    }
    var inputStatus = input.inputStatus, pointers = input.pointers, changedPointers = input.changedPointers;
    var pointerLength = pointers.length;
    var changedPointerLength = changedPointers.length;
    var isFirst = (INPUT_START === inputStatus) && (0 === changedPointerLength - pointerLength);
    var isFinal = (INPUT_END === inputStatus) && (0 === pointerLength);
    if (0 < pointerLength) {
        var _a = getCenter(input.pointers), x = _a.x, y = _a.y;
        centerX = x;
        centerY = y;
    }
    var timestamp = Date.now();
    var target = event.target, currentTarget = event.currentTarget;
    return __assign({}, input, { isFirst: isFirst,
        isFinal: isFinal,
        pointerLength: pointerLength,
        changedPointerLength: changedPointerLength,
        centerX: centerX,
        centerY: centerY, x: centerX, y: centerY, timestamp: timestamp,
        target: target,
        currentTarget: currentTarget, nativeEvent: event });
});
//# sourceMappingURL=create.js.map

var startInput;
var prevInput;
var activeInput;
var startMutliInput;
var inputManage = (function (event) {
    var input = createInput(event);
    if (undefined === input)
        return;
    var inputStatus = input.inputStatus;
    if ('start' === inputStatus) {
        activeInput = input;
        startInput = input;
        if (1 < input.pointerLength) {
            startMutliInput = input;
        }
        else {
            startMutliInput = undefined;
        }
    }
    else if ('move' === inputStatus) {
        prevInput = activeInput;
        activeInput = input;
    }
    else if ('end' === inputStatus) {
        prevInput = activeInput;
        activeInput = input;
    }
    return {
        startMutliInput: startMutliInput,
        startInput: startInput,
        prevInput: prevInput,
        input: input
    };
});
//# sourceMappingURL=inputManage.js.map

var _prevInput;
var _prevVelocityX;
var _prevVelocityY;
var _prevDirection;
var computeLast = (function (input) {
    var velocityX;
    var velocityY;
    var direction;
    _prevInput = _prevInput || input;
    var deltaTime = input.timestamp - _prevInput.timestamp;
    var deltaX = (0 < input.centerX) ? input.centerX - _prevInput.centerX : 0;
    var deltaY = (0 < input.centerY) ? input.centerY - _prevInput.centerY : 0;
    if (COMPUTE_INTERVAL < deltaTime) {
        velocityX = Math.round(Math.abs(deltaX / deltaTime) * 100) / 100;
        velocityY = Math.round(Math.abs(deltaY / deltaTime) * 100) / 100;
        direction = getDirection(deltaX, deltaY);
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

var prevDisplacementX = 0;
var prevDisplacementY = 0;
function computeDistance (_a) {
    var startInput = _a.startInput, input = _a.input;
    var inputStatus = input.inputStatus;
    var round = Math.round, abs = Math.abs;
    var displacementX = 0;
    var displacementY = 0;
    if ('start' === inputStatus) {
        prevDisplacementX = prevDisplacementY = 0;
    }
    else if ('move' === inputStatus) {
        displacementX = round(input.pointers[0][propX] - startInput.pointers[0][propX]);
        displacementY = round(input.pointers[0][propY] - startInput.pointers[0][propY]);
        prevDisplacementX = displacementX;
        prevDisplacementY = displacementY;
    }
    else if ('end' === inputStatus) {
        displacementX = prevDisplacementX;
        displacementY = prevDisplacementY;
    }
    var distanceX = abs(displacementX);
    var distanceY = abs(displacementY);
    var distance = round(getVLength({ x: distanceX, y: distanceY }));
    return {
        displacementX: displacementX, displacementY: displacementY, distanceX: distanceX, distanceY: distanceY, distance: distance
    };
}
//# sourceMappingURL=computeDistance.js.map

function computeDeltaXY (_a) {
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
//# sourceMappingURL=computeDeltaXY.js.map

var computeVector = (function (input) { return ({
    x: input.pointers[1][propX] - input.pointers[0][propX],
    y: input.pointers[1][propY] - input.pointers[0][propY]
}); });
//# sourceMappingURL=computeVector.js.map

function computeScale (_a) {
    var startV = _a.startV, prevV = _a.prevV, activeV = _a.activeV;
    var deltaScale = getVLength(activeV) / getVLength(prevV);
    var scale = getVLength(activeV) / getVLength(startV);
    return { scale: scale, deltaScale: deltaScale };
}
//# sourceMappingURL=computeScale.js.map

function computeAngle (_a) {
    var startV = _a.startV, prevV = _a.prevV, activeV = _a.activeV;
    var deltaAngle = getAngle(activeV, prevV);
    var angle = getAngle(activeV, startV);
    return { angle: angle, deltaAngle: deltaAngle };
}
//# sourceMappingURL=computeAngle.js.map

var maxLength = 0;
var computeMaxLength = (function (_a) {
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

function compute (_a) {
    var startInput = _a.startInput, prevInput = _a.prevInput, startMutliInput = _a.startMutliInput, input = _a.input;
    if (undefined === input)
        return;
    var abs = Math.abs, max = Math.max;
    var computed = {
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
        scale: undefined,
        deltaScale: 1,
        lastVelocity: undefined,
        lastVelocityY: undefined,
        lastVelocityX: undefined
    };
    var _b = computeDistance({
        startInput: startInput,
        input: input
    }), displacementX = _b.displacementX, displacementY = _b.displacementY, distanceX = _b.distanceX, distanceY = _b.distanceY, distance = _b.distance;
    computed = __assign({}, computed, { displacementX: displacementX, displacementY: displacementY, distanceX: distanceX, distanceY: distanceY, distance: distance });
    computed.direction = getDirection(displacementX, displacementY);
    computed.duration = input.timestamp - startInput.timestamp;
    var lastComputed = computeLast(input);
    computed.lastVelocityX = lastComputed.velocityX;
    computed.lastVelocityY = lastComputed.velocityY;
    computed.lastVelocity = lastComputed.velocity;
    computed.lastDirection = lastComputed.direction;
    var _c = computeDeltaXY({ input: input, prevInput: prevInput }), deltaX = _c.deltaX, deltaY = _c.deltaY;
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
        var startV = computeVector(startMutliInput);
        var prevV = computeVector(prevInput);
        var activeV = computeVector(input);
        var _d = computeScale({
            startV: startV, activeV: activeV, prevV: prevV
        }), deltaScale = _d.deltaScale, scale = _d.scale;
        computed.scale = scale;
        computed.deltaScale = deltaScale;
        var _e = computeAngle({ startV: startV, prevV: prevV, activeV: activeV }), angle = _e.angle, deltaAngle = _e.deltaAngle;
        computed.angle = angle;
        computed.deltaAngle = deltaAngle;
    }
    var maxPointerLength = computeMaxLength(input);
    return __assign({}, input, { maxPointerLength: maxPointerLength }, computed);
}
//# sourceMappingURL=index.js.map

var computeTouchAction = (function (touchActions) {
    var e_1, _a;
    var TOUCH_ACTION_PRIORITY = {
        auto: 0,
        manipulation: 1,
        'pan-x': 2,
        'pan-y': 2,
        none: 3
    };
    var MAX_PRIORITY = TOUCH_ACTION_PRIORITY['none'];
    var touchActionCSSArray = ['auto'];
    var prevPriority = 0;
    try {
        for (var touchActions_1 = __values(touchActions), touchActions_1_1 = touchActions_1.next(); !touchActions_1_1.done; touchActions_1_1 = touchActions_1.next()) {
            var touchAction = touchActions_1_1.value;
            var activePriority = TOUCH_ACTION_PRIORITY[touchAction];
            if (MAX_PRIORITY === activePriority) {
                touchActionCSSArray = [touchAction];
                break;
            }
            else if (prevPriority < activePriority) {
                touchActionCSSArray = [touchAction];
                prevPriority = activePriority;
            }
            else if (prevPriority === activePriority && 0 < activePriority) {
                touchActionCSSArray.push(touchAction);
                prevPriority = activePriority;
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (touchActions_1_1 && !touchActions_1_1.done && (_a = touchActions_1["return"])) _a.call(touchActions_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return touchActionCSSArray.join(' ');
});
//# sourceMappingURL=computeTouchAction.js.map

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

function __values$1(o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
}

function __read$1(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
}

function __spread$1() {
    for (var ar = [], i = 0; i < arguments.length; i++)
        ar = ar.concat(__read$1(arguments[i]));
    return ar;
}

var EventEmitter = (function () {
    function EventEmitter() {
        this._listenersMap = {};
    }
    EventEmitter.prototype.on = function (eventName, listener) {
        if (undefined === this._listenersMap[eventName]) {
            this._listenersMap[eventName] = [];
        }
        this._listenersMap[eventName].push(listener);
        return this;
    };
    EventEmitter.prototype.once = function (eventName, listener) {
        listener.isOnce = true;
        this.on(eventName, listener);
        return this;
    };
    EventEmitter.prototype.off = function (eventName, listener) {
        var listeners = this._listenersMap[eventName];
        if (undefined !== listeners) {
            if (undefined === listener) {
                delete this._listenersMap[eventName];
            }
            else {
                var index = listeners.findIndex(function (fn) { return fn === listener; });
                listeners.splice(index, 1);
            }
        }
        return this;
    };
    EventEmitter.prototype.emit = function (eventName) {
        var payload = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            payload[_i - 1] = arguments[_i];
        }
        var e_1, _a;
        var listeners = this._listenersMap[eventName];
        if (undefined !== listeners && 0 < listeners.length) {
            try {
                for (var _b = __values$1(listeners.entries()), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var _d = __read$1(_c.value, 2), index = _d[0], listener = _d[1];
                    if (listener.isOnce) {
                        var listenerClone = listener;
                        listeners.splice(index, 1);
                        listenerClone.apply(void 0, __spread$1(payload));
                    }
                    else {
                        listener.apply(void 0, __spread$1(payload));
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b["return"])) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return true;
        }
        else {
            return false;
        }
    };
    EventEmitter.prototype.destroy = function () {
        this._listenersMap = {};
    };
    return EventEmitter;
}());

var STATUS_POSSIBLE = 'possible';
var STATUS_START = 'start';
var STATUS_MOVE = 'move';
var STATUS_END = 'end';
var STATUS_CANCELLED = 'cancel';
var STATUS_FAILED = 'failed';
var STATUS_RECOGNIZED = 'recognized';
//# sourceMappingURL=recognizerStatus.js.map

var Recognizer = (function () {
    function Recognizer(options) {
        if (options === void 0) { options = { disabled: false }; }
        this.options = __assign({}, this["default"], options);
        this.name = this.options.name;
        this.status = STATUS_POSSIBLE;
        this.isRecognized = false;
        this.requireFailureRecognizers = [];
    }
    Recognizer.prototype.set = function (options) {
        this.options = __assign({}, this.options, options);
        Recognizer.prototype.$root.update();
    };
    Recognizer.prototype.emit = function (type, payload) {
        payload.type = type;
        this.eventBus.emit(type, payload);
        if (this.hasDomEvents) {
            var target = payload.target, currentTarget = payload.currentTarget, type_1 = payload.type, data = __rest(payload, ["target", "currentTarget", "type"]);
            var event = new Event(type_1, payload);
            Object.assign(event, data);
            this.el.dispatchEvent(event);
        }
    };
    Recognizer.prototype.on = function (type, listener) {
        this.eventBus.on(type, listener);
    };
    Recognizer.prototype.off = function (type, listener) {
        this.eventBus.off(type, listener);
    };
    Recognizer.prototype.requireFailure = function (recognizer) {
        if (!this.requireFailureRecognizers.includes(recognizer)) {
            this.requireFailureRecognizers.push(recognizer);
        }
    };
    Recognizer.prototype.hasRequireFailure = function () {
        return 0 < this.requireFailureRecognizers.length;
    };
    Recognizer.prototype.isTheOtherFail = function () {
        var length = this.requireFailureRecognizers.length;
        for (var index = 0; index < length; index++) {
            var recognizer = this.requireFailureRecognizers[index];
            if (STATUS_FAILED !== recognizer.status && STATUS_POSSIBLE !== recognizer.status) {
                return false;
            }
        }
        return true;
    };
    Recognizer.prototype.isValidPointerLength = function (pointerLength) {
        return 0 === this.options.pointerLength || this.options.pointerLength === pointerLength;
    };
    Recognizer.prototype.isOnlyHorizontal = function () {
        var e_1, _a;
        var isOnlyHorizontal = true;
        try {
            for (var _b = __values(this.options.directions), _c = _b.next(); !_c.done; _c = _b.next()) {
                var direction = _c.value;
                isOnlyHorizontal = -1 < ['left', 'right'].indexOf(direction);
                if (!isOnlyHorizontal) {
                    return false;
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b["return"])) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return isOnlyHorizontal;
    };
    Recognizer.prototype.isOnlyVertical = function () {
        var e_2, _a;
        var isOnlyVertical = true;
        try {
            for (var _b = __values(this.options.directions), _c = _b.next(); !_c.done; _c = _b.next()) {
                var direction = _c.value;
                isOnlyVertical = -1 < ['up', 'down'].indexOf(direction);
                if (!isOnlyVertical) {
                    return false;
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b["return"])) _a.call(_b);
            }
            finally { if (e_2) throw e_2.error; }
        }
        return isOnlyVertical;
    };
    Recognizer.prototype.isVaildDirection = function (direction) {
        return -1 < this.options.directions.indexOf(direction);
    };
    Recognizer.prototype.recognize = function (computed) {
        if (this.options.disabled)
            return;
        var inputStatus = computed.inputStatus;
        var isVaild = this.test(computed);
        if (-1 < [STATUS_END, STATUS_CANCELLED, STATUS_FAILED, STATUS_RECOGNIZED].indexOf(this.status)) {
            this.status = STATUS_POSSIBLE;
        }
        if (!isVaild && STATUS_POSSIBLE === this.status && INPUT_END === inputStatus) {
            this.status = STATUS_FAILED;
        }
        else if (STATUS_POSSIBLE === this.status && INPUT_END === inputStatus && isVaild) {
            this.status = STATUS_RECOGNIZED;
        }
        else if (STATUS_POSSIBLE === this.status && INPUT_MOVE === inputStatus && isVaild) {
            this.status = STATUS_START;
        }
        else if (STATUS_START === this.status && INPUT_MOVE === inputStatus) {
            this.status = STATUS_MOVE;
        }
        else if (STATUS_MOVE === this.status && INPUT_END === inputStatus) {
            this.status = STATUS_END;
        }
        else if ((STATUS_START === this.status || STATUS_MOVE === this.status) && INPUT_CANCEL === inputStatus || !isVaild) {
            this.status = STATUS_CANCELLED;
        }
        this.isRecognized = -1 < [STATUS_START, STATUS_MOVE, STATUS_RECOGNIZED].indexOf(this.status);
        if (this.isRecognized) {
            this.afterRecognized(computed);
            this.emit(this.options.name, computed);
            if (-1 < [STATUS_START, STATUS_MOVE, STATUS_END, STATUS_RECOGNIZED].indexOf(this.status)) {
                this.emit(this.options.name + this.status, computed);
                this.afterEmit(computed);
            }
        }
    };
    Recognizer.prototype.afterRecognized = function (computed) { };
    Recognizer.prototype.afterEmit = function (computed) { };
    return Recognizer;
}());
Recognizer.prototype.$root = {};
Recognizer.prototype.eventBus = new EventEmitter();
Recognizer.$inject = function (key, method) {
    Recognizer.prototype.$root[key] = method;
};
//# sourceMappingURL=Base.js.map

var setTimeout = window.setTimeout, clearTimeout$1 = window.clearTimeout;
var TapRecognizer = (function (_super) {
    __extends(TapRecognizer, _super);
    function TapRecognizer(options) {
        if (options === void 0) { options = {}; }
        var _this = _super.call(this, options) || this;
        _this.tapTimeoutId = null;
        _this.tapCount = 0;
        return _this;
    }
    TapRecognizer.prototype.getTouchAction = function () {
        return (1 < this.options.taps) ? ['manipulation'] : ['auto'];
    };
    TapRecognizer.prototype.recognize = function (computed) {
        var _this = this;
        if (this.options.disabled)
            return;
        this.status = STATUS_POSSIBLE;
        if (this.test(computed)) {
            this.tapCount++;
            var isValidTapCount_1 = this.options.taps === this.tapCount;
            if (this.hasRequireFailure()) {
                this.cancel();
                this.tapTimeoutId = setTimeout(function () {
                    if (isValidTapCount_1 && _this.isTheOtherFail()) {
                        _this.status = STATUS_RECOGNIZED;
                        _this.emit(_this.options.name, __assign({}, computed, { tapCount: _this.tapCount }));
                    }
                    _this.tapCount = 0;
                }, this.options.interval);
            }
            else {
                this.cancel();
                if (isValidTapCount_1) {
                    this.emit(this.options.name, __assign({}, computed, { tapCount: this.tapCount }));
                    this.tapCount = 0;
                }
                this.tapTimeoutId = setTimeout(function () {
                    _this.status = STATUS_FAILED;
                    _this.tapCount = 0;
                }, this.options.interval);
            }
        }
    };
    TapRecognizer.prototype.cancel = function () {
        clearTimeout$1(this.tapTimeoutId);
    };
    TapRecognizer.prototype.test = function (computed) {
        var abs = Math.abs, max = Math.max;
        var inputStatus = computed.inputStatus, distance = computed.distance, duration = computed.duration, maxPointerLength = computed.maxPointerLength, centerX = computed.centerX, centerY = computed.centerY;
        this._prevX = centerX;
        this._prevY = centerY;
        var offsetX = abs(centerX - this._prevX);
        var offsetY = abs(centerY - this._prevY);
        var hasMove = 2 < max(offsetX, offsetY);
        return INPUT_END === inputStatus && 1 === maxPointerLength && 2 > distance && 250 > duration && !hasMove;
    };
    TapRecognizer.prototype.afterEmit = function (computed) { };
    return TapRecognizer;
}(Recognizer));
TapRecognizer.prototype["default"] = {
    name: 'tap',
    pointer: 1,
    taps: 1,
    interval: 300,
    disabled: false
};
//# sourceMappingURL=Tap.js.map

var PressRecognizer = (function (_super) {
    __extends(PressRecognizer, _super);
    function PressRecognizer(options) {
        if (options === void 0) { options = {}; }
        var _this = _super.call(this, options) || this;
        _this._timeoutId = null;
        _this._isPressing = false;
        return _this;
    }
    PressRecognizer.prototype.getTouchAction = function () {
        return ['auto'];
    };
    PressRecognizer.prototype.recognize = function (computed) {
        var _this = this;
        if (this.options.disabled)
            return;
        var inputStatus = computed.inputStatus;
        if (STATUS_RECOGNIZED !== this.status) {
            var IS_VALID = this.test(computed);
            if (!this._isPressing && IS_VALID) {
                this._isPressing = true;
                this._timeoutId = window.setTimeout(function () {
                    _this.status = STATUS_RECOGNIZED;
                    _this.emit(_this.options.name, computed);
                }, this.options.minPressTime);
            }
            else {
                if (!IS_VALID) {
                    this.cancel();
                }
            }
        }
        else {
            if (INPUT_END === inputStatus) {
                this.emit(this.options.name + "up", computed);
                this.status = STATUS_POSSIBLE;
                this._isPressing = false;
            }
        }
    };
    PressRecognizer.prototype.test = function (_a) {
        var pointerLength = _a.pointerLength, inputStatus = _a.inputStatus, distance = _a.distance;
        var IS_VALID_INPUT = 'start' === inputStatus || 'move' === inputStatus;
        var IS_VLIAD_DISTANCE = this.options.threshold > distance;
        return this.isValidPointerLength(pointerLength) && IS_VALID_INPUT && IS_VLIAD_DISTANCE;
    };
    PressRecognizer.prototype.cancel = function () {
        clearTimeout(this._timeoutId);
        this.status = STATUS_FAILED;
        this._isPressing = false;
    };
    PressRecognizer.prototype.afterEmit = function () { };
    return PressRecognizer;
}(Recognizer));
PressRecognizer.prototype["default"] = {
    name: 'press',
    pointerLength: 1,
    threshold: 9,
    minPressTime: 251,
    disabled: false
};
//# sourceMappingURL=Press.js.map

var getHV = (function (directions) {
    var e_1, _a;
    var hasHorizontal = false;
    var hasVertical = false;
    try {
        for (var directions_1 = __values(directions), directions_1_1 = directions_1.next(); !directions_1_1.done; directions_1_1 = directions_1.next()) {
            var direction = directions_1_1.value;
            if (-1 < ['left', 'right'].indexOf(direction)) {
                hasHorizontal = true;
                if (hasVertical)
                    break;
            }
            else if (-1 < ['up', 'down'].indexOf(direction)) {
                hasVertical = true;
                if (hasHorizontal)
                    break;
            }
            else {
                throw new Error('wrong direction!');
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (directions_1_1 && !directions_1_1.done && (_a = directions_1["return"])) _a.call(directions_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return { hasHorizontal: hasHorizontal, hasVertical: hasVertical };
});
//# sourceMappingURL=getHV.js.map

var PanRecognizer = (function (_super) {
    __extends(PanRecognizer, _super);
    function PanRecognizer(options) {
        if (options === void 0) { options = {}; }
        return _super.call(this, options) || this;
    }
    PanRecognizer.prototype.getTouchAction = function () {
        var touchActions = ['auto'];
        var _a = getHV(this.options.directions), hasHorizontal = _a.hasHorizontal, hasVertical = _a.hasVertical;
        if (hasHorizontal && hasVertical) {
            touchActions = ['none'];
        }
        else if (!hasHorizontal && hasVertical) {
            touchActions = ['pan-x'];
        }
        else if (!hasVertical && hasHorizontal) {
            touchActions = ['pan-y'];
        }
        return touchActions;
    };
    PanRecognizer.prototype.test = function (_a) {
        var distance = _a.distance, lastDirection = _a.lastDirection, inputStatus = _a.inputStatus, pointerLength = _a.pointerLength;
        var isValidDirection = this.isVaildDirection(lastDirection);
        var isValidThreshold = this.options.threshold < distance;
        return this.isValidPointerLength(pointerLength) && isValidDirection &&
            (this.isRecognized || isValidThreshold) && INPUT_MOVE === inputStatus;
    };
    PanRecognizer.prototype.afterEmit = function (computed) {
        this.emit(this.options.name + computed.lastDirection, computed);
    };
    PanRecognizer.prototype.afterRecognized = function (computed) {
        this.lockDirection(computed);
    };
    PanRecognizer.prototype.lockDirection = function (computed) {
        if (undefined === this.options.directions || 0 === this.options.directions.length)
            return computed;
        var deltaX = 0;
        var deltaY = 0;
        this.options.directions.forEach(function (direction) {
            if ('left' === direction && 0 > computed.deltaX) {
                deltaX = computed.deltaX;
            }
            else if ('right' === direction && 0 < computed.deltaX) {
                deltaX = computed.deltaX;
            }
            else if ('down' === direction && 0 < computed.deltaY) {
                deltaY = computed.deltaY;
            }
            else if ('up' === direction && 0 > computed.deltaY) {
                deltaY = computed.deltaY;
            }
        });
        computed.deltaX = deltaX;
        computed.deltaY = deltaY;
        return computed;
    };
    return PanRecognizer;
}(Recognizer));
PanRecognizer.prototype["default"] = {
    name: 'pan',
    threshold: 10,
    pointerLength: 1,
    directions: ['up', 'right', 'down', 'left']
};
//# sourceMappingURL=Pan.js.map

var SwipeRecognizer = (function (_super) {
    __extends(SwipeRecognizer, _super);
    function SwipeRecognizer(options) {
        if (options === void 0) { options = {}; }
        return _super.call(this, options) || this;
    }
    SwipeRecognizer.prototype.getTouchAction = function () {
        return ['none'];
    };
    SwipeRecognizer.prototype.afterEmit = function (computed) {
        this.emit(this.options.name + computed.lastDirection, computed);
    };
    SwipeRecognizer.prototype.test = function (computed) {
        var inputStatus = computed.inputStatus, lastDirection = computed.lastDirection, direction = computed.direction, lastVelocityX = computed.lastVelocityX, lastVelocityY = computed.lastVelocityY, maxPointerLength = computed.maxPointerLength, distance = computed.distance;
        var vaildVelocityX = lastVelocityX;
        var vaildVelocityY = lastVelocityY;
        if (this.isOnlyHorizontal()) {
            vaildVelocityY = 0;
        }
        else if (this.isOnlyVertical()) {
            vaildVelocityX = 0;
        }
        var vaildVelocity = Math.sqrt(vaildVelocityX * vaildVelocityX + vaildVelocityY * vaildVelocityY);
        return 1 === maxPointerLength &&
            this.options.threshold < distance &&
            INPUT_END === inputStatus &&
            this.isVaildDirection(lastDirection) &&
            this.options.velocity < vaildVelocity;
    };
    return SwipeRecognizer;
}(Recognizer));
SwipeRecognizer.prototype["default"] = {
    name: 'swipe',
    threshold: 10,
    velocity: 0.3,
    pointerLength: 1,
    directions: ['up', 'right', 'down', 'left']
};
//# sourceMappingURL=Swipe.js.map

var PinchRecognizer = (function (_super) {
    __extends(PinchRecognizer, _super);
    function PinchRecognizer(options) {
        if (options === void 0) { options = {}; }
        var _this = _super.call(this, options) || this;
        _this._prevScale = 1;
        return _this;
    }
    PinchRecognizer.prototype.getTouchAction = function () {
        return ['none'];
    };
    PinchRecognizer.prototype.afterEmit = function (computed) {
        var scale = computed.scale;
        if (1 !== scale) {
            var inOrOut = scale > this._prevScale ? 'out' : 'in';
            this.emit(this.options.name + inOrOut, computed);
        }
        this._prevScale = scale;
    };
    PinchRecognizer.prototype.test = function (_a) {
        var pointerLength = _a.pointerLength, scale = _a.scale;
        return this.isValidPointerLength(pointerLength) && (this.options.threshold < Math.abs(scale - 1) || this.isRecognized);
    };
    return PinchRecognizer;
}(Recognizer));
PinchRecognizer.prototype["default"] = {
    name: 'pinch',
    threshold: 0,
    pointerLength: 2
};
//# sourceMappingURL=Pinch.js.map

var RotateRecognizer = (function (_super) {
    __extends(RotateRecognizer, _super);
    function RotateRecognizer(options) {
        if (options === void 0) { options = {}; }
        return _super.call(this, options) || this;
    }
    RotateRecognizer.prototype.getTouchAction = function () {
        return ['none'];
    };
    RotateRecognizer.prototype.afterEmit = function (computed) { };
    RotateRecognizer.prototype.test = function (_a) {
        var pointerLength = _a.pointerLength, angle = _a.angle;
        return this.isValidPointerLength(pointerLength) && (this.options.threshold < Math.abs(angle) || this.isRecognized);
    };
    return RotateRecognizer;
}(Recognizer));
RotateRecognizer.prototype["default"] = {
    name: 'rotate',
    threshold: 0,
    pointerLength: 2
};
//# sourceMappingURL=Rotate.js.map

var AnyTouch = (function () {
    function AnyTouch(el, options) {
        this.version = '0.0.12';
        this.el = el;
        this.isMobile = IS_MOBILE;
        this.options = __assign({}, this["default"], options);
        this.recognizers = [
            new TapRecognizer(),
            new PressRecognizer(),
            new PanRecognizer(),
            new SwipeRecognizer(),
            new PinchRecognizer(),
            new RotateRecognizer(),
        ];
        Recognizer.prototype.el = el;
        Recognizer.prototype.hasDomEvents = this.options.hasDomEvents;
        Recognizer.$inject('update', this.update.bind(this));
        this.update();
        this.unbinders = this._bindRecognizers(this.el);
    }
    AnyTouch.prototype.updateTouchAction = function (el) {
        var e_1, _a;
        if ('compute' === this.options.touchAction) {
            var touchActions = [];
            try {
                for (var _b = __values(this.recognizers), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var recognizer = _c.value;
                    touchActions.push.apply(touchActions, __spread(recognizer.getTouchAction()));
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b["return"])) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
            el.style.touchAction = computeTouchAction(touchActions);
        }
        else {
            el.style.touchAction = this.options.touchAction;
        }
    };
    AnyTouch.prototype.update = function () {
        this.updateTouchAction(this.el);
    };
    AnyTouch.prototype._bindRecognizers = function (el) {
        var boundFn = this.handler.bind(this);
        if (this.isMobile) {
            return ['touchstart', 'touchmove', 'touchend', 'touchcancel'].map(function (eventName) {
                el.addEventListener(eventName, boundFn, { passive: false });
                return function () {
                    el.removeEventListener(eventName, boundFn);
                };
            });
        }
        else {
            el.addEventListener('mousedown', boundFn);
            window.addEventListener('mousemove', boundFn);
            window.addEventListener('mouseup', boundFn);
            return [
                function () {
                    el.removeEventListener('mousedown', boundFn);
                },
                function () {
                    window.removeEventListener('mousemove', boundFn);
                },
                function () {
                    window.removeEventListener('mouseup', boundFn);
                }
            ];
        }
    };
    AnyTouch.prototype.add = function (recognizer) {
        this.recognizers.push(recognizer);
    };
    AnyTouch.prototype.get = function (name) {
        return this.recognizers.find(function (recognizer) { return name === recognizer.options.name; });
    };
    AnyTouch.prototype.set = function (options) {
        this.options = __assign({}, this["default"], options);
        this.update();
    };
    AnyTouch.prototype.remove = function (recognizerName) {
        var e_2, _a;
        try {
            for (var _b = __values(this.recognizers.entries()), _c = _b.next(); !_c.done; _c = _b.next()) {
                var _d = __read(_c.value, 2), index = _d[0], recognizer = _d[1];
                if (recognizerName === recognizer.options.name) {
                    this.recognizers.splice(index, 1);
                    break;
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b["return"])) _a.call(_b);
            }
            finally { if (e_2) throw e_2.error; }
        }
    };
    AnyTouch.prototype.handler = function (event) {
        if (!event.cancelable) {
            Recognizer.prototype.emit('error', { code: 0, message: '页面滚动的时候, 请暂时不要操作元素!' });
        }
        if (this.options.isPreventDefault) {
            event.preventDefault();
        }
        var inputs = inputManage(event);
        if (undefined !== inputs) {
            var computed_1 = compute(inputs);
            this.recognizers.forEach(function (recognizer) {
                recognizer.recognize(computed_1);
            });
        }
    };
    AnyTouch.prototype.on = function (type, listener) {
        Recognizer.prototype.on(type, listener);
    };
    AnyTouch.prototype.off = function (type, listener) {
        Recognizer.prototype.off(type, listener);
    };
    AnyTouch.prototype.destroy = function () {
        this.unbinders.forEach(function (unbinder) {
            unbinder();
        });
    };
    AnyTouch.TapRecognizer = TapRecognizer;
    AnyTouch.PressRecognizer = PressRecognizer;
    AnyTouch.PanRecognizer = PanRecognizer;
    AnyTouch.SwipeRecognizer = SwipeRecognizer;
    AnyTouch.PinchRecognizer = PinchRecognizer;
    AnyTouch.RotateRecognizer = RotateRecognizer;
    return AnyTouch;
}());
AnyTouch.prototype["default"] = {
    touchAction: 'compute',
    hasDomEvents: true,
    isPreventDefault: true
};
//# sourceMappingURL=main.js.map

export default AnyTouch;
