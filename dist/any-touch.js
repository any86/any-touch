/*!
 * AnyTouch.js v0.4.10
 * (c) 2018-2019 Russell
 * https://github.com/any86/any-touch
 * Released under the MIT License.
 */
var AnyTouch = (function () {
    'use strict';

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
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
                if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                    t[p[i]] = s[p[i]];
            }
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

    /*!
     * AnyEvent.js v0.5.0
     * (c) 2018-2019 Russell
     * https://github.com/any86/any-touch
     * Released under the MIT License.
     */
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

    var AnyEvent = (function () {
        function AnyEvent() {
            this._listenersMap = {};
        }
        AnyEvent.prototype.on = function (eventName, listener) {
            if (undefined === this._listenersMap[eventName]) {
                this._listenersMap[eventName] = [];
            }
            this._listenersMap[eventName].push(listener);
            return this;
        };
        AnyEvent.prototype.once = function (eventName, listener) {
            listener.isOnce = true;
            this.on(eventName, listener);
            return this;
        };
        AnyEvent.prototype.off = function (eventName, listener) {
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
        AnyEvent.prototype.emit = function (eventName) {
            var e_1, _a;
            var payload = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                payload[_i - 1] = arguments[_i];
            }
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
                        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
                return true;
            }
            else {
                return false;
            }
        };
        AnyEvent.prototype.has = function (eventName) {
            return undefined !== this._listenersMap[eventName] && 0 < this._listenersMap[eventName].length;
        };
        AnyEvent.prototype.getEventNames = function () {
            var eventNames = [];
            for (var eventName in this._listenersMap) {
                eventNames.push(eventName);
            }
            return eventNames;
        };
        AnyEvent.prototype.eventNames = function () {
            return this.getEventNames();
        };
        AnyEvent.prototype.destroy = function () {
            this._listenersMap = {};
        };
        return AnyEvent;
    }());

    var IS_WX = undefined === window;
    var SUPPORT_TOUCH = IS_WX || ('ontouchstart' in window);
    var AUTO = 'auto';
    var NONE = 'none';
    var MANIPULATION = 'manipulation';
    var DIRECTION_LEFT = 'left';
    var DIRECTION_RIGHT = 'right';
    var DIRECTION_UP = 'up';
    var DIRECTION_DOWN = 'down';
    var DIRECTION_X = [DIRECTION_LEFT, DIRECTION_RIGHT];
    var DIRECTION_Y = [DIRECTION_UP, DIRECTION_DOWN];
    var DIRECTION_ALL = [DIRECTION_LEFT, DIRECTION_RIGHT, DIRECTION_UP, DIRECTION_DOWN];
    var PAN_X = 'pan-x';
    var PAN_Y = 'pan-y';
    var COMPUTE = 'compute';
    var COMPUTE_INTERVAL = 16;
    var CLIENT_X = 'clientX';
    var CLIENT_Y = 'clientY';
    var INPUT_START = 'start';
    var INPUT_MOVE = 'move';
    var INPUT_CANCEL = 'cancel';
    var INPUT_END = 'end';
    var TOUCH = 'touch';
    var MOUSE = 'mouse';
    var TOUCH_START = 'touchstart';
    var TOUCH_MOVE = 'touchmove';
    var TOUCH_END = 'touchend';
    var TOUCH_CANCEL = 'touchcancel';
    var MOUSE_UP = 'mouseup';
    var MOUSE_MOVE = 'mousemove';
    var MOUSE_DOWN = 'mousedown';
    var WRONG_DIRECTION = 'wrong direction!';

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
        return radianToAngle(angle);
    };
    var radianToAngle = function (radian) { return radian / Math.PI * 180; };
    var angleToRadian = function (angle) { return angle / 180 * Math.PI; };
    var getCenter = function (points) {
        var length = points.length;
        var countPoint = points.reduce(function (countPoint, point) {
            countPoint.x += point[CLIENT_X];
            countPoint.y += point[CLIENT_Y];
            return countPoint;
        }, { x: 0, y: 0 });
        return { x: Math.round(countPoint.x / length), y: Math.round(countPoint.y / length) };
    };
    var getDirection = function (x, y) {
        if (x === y) {
            return NONE;
        }
        else if (Math.abs(x) > Math.abs(y)) {
            return 0 < x ? DIRECTION_RIGHT : DIRECTION_LEFT;
        }
        else {
            return 0 < y ? DIRECTION_DOWN : DIRECTION_UP;
        }
    };

    var Vector = /*#__PURE__*/Object.freeze({
        getVLength: getVLength,
        getDotProduct: getDotProduct,
        getRadian: getRadian,
        getCross: getCross,
        getAngle: getAngle,
        radianToAngle: radianToAngle,
        angleToRadian: angleToRadian,
        getCenter: getCenter,
        getDirection: getDirection
    });

    var default_1 = (function () {
        function default_1() {
        }
        return default_1;
    }());

    var default_1$1 = (function (_super) {
        __extends(default_1$$1, _super);
        function default_1$$1() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        default_1$$1.prototype.load = function (event) {
            var points = Array.from(event.targetTouches || event.touches).map(function (_a) {
                var clientX = _a.clientX, clientY = _a.clientY;
                return ({ clientX: clientX, clientY: clientY });
            });
            var changedPoints = Array.from(event.changedTouches).map(function (_a) {
                var clientX = _a.clientX, clientY = _a.clientY;
                return ({ clientX: clientX, clientY: clientY });
            });
            return {
                eventType: event.type.replace('touch', ''),
                changedPoints: changedPoints,
                points: points,
                nativeEvent: event
            };
        };
        return default_1$$1;
    }(default_1));

    var default_1$2 = (function (_super) {
        __extends(default_1$$1, _super);
        function default_1$$1() {
            var _this = _super.call(this) || this;
            _this.isPressed = false;
            return _this;
        }
        default_1$$1.prototype.load = function (event) {
            var clientX = event.clientX, clientY = event.clientY, type = event.type, button = event.button;
            var changedPoints = this.prevPoints || [{ clientX: clientX, clientY: clientY }];
            var points = [{ clientX: clientX, clientY: clientY }];
            this.prevPoints = [{ clientX: clientX, clientY: clientY }];
            if ('mousedown' === type) {
                if (0 === button) {
                    this.isPressed = true;
                }
                else {
                    return;
                }
            }
            if ('mousemove' === type) {
                if (!this.isPressed)
                    return;
            }
            else if ('mouseup' === type) {
                if (this.isPressed) {
                    points = [];
                }
                else {
                    return;
                }
                this.isPressed = false;
            }
            var MAP = {
                mousedown: INPUT_START,
                mousemove: INPUT_MOVE,
                mouseup: INPUT_END
            };
            return {
                eventType: MAP[type],
                changedPoints: changedPoints,
                points: points,
                nativeEvent: event
            };
        };
        return default_1$$1;
    }(default_1));

    var default_1$3 = (function () {
        function default_1() {
            this.adapter = SUPPORT_TOUCH ? new default_1$1() : new default_1$2();
        }
        default_1.prototype.load = function (event) {
            var BASE_INPUT = this.adapter.load(event);
            if (undefined === BASE_INPUT) {
                return;
            }
            var eventType = BASE_INPUT.eventType, points = BASE_INPUT.points, changedPoints = BASE_INPUT.changedPoints;
            var pointLength = points.length;
            var changedPointLength = changedPoints.length;
            var isStart = (INPUT_START === eventType);
            var isEnd = (INPUT_END === eventType || INPUT_CANCEL === eventType);
            if (0 < pointLength) {
                this._center = getCenter(BASE_INPUT.points);
            }
            var timestamp = Date.now();
            var target = event.target, currentTarget = event.currentTarget;
            var _a = (this._center || {}), x = _a.x, y = _a.y;
            return __assign({}, BASE_INPUT, { preventDefault: function () {
                    event.preventDefault();
                }, isStart: isStart,
                isEnd: isEnd,
                pointLength: pointLength,
                changedPointLength: changedPointLength, center: this._center, x: x, y: y,
                timestamp: timestamp,
                target: target,
                currentTarget: currentTarget, nativeEvent: event });
        };
        return default_1;
    }());

    var intervalCompute = (function (_a, $store) {
        var prevInput = _a.prevInput, input = _a.input;
        var velocityX = 0;
        var velocityY = 0;
        var speedX = 0;
        var speedY = 0;
        var direction = NONE;
        if (undefined !== input) {
            var _prevInput = prevInput || input;
            var deltaTime = input.timestamp - _prevInput.timestamp;
            if (-1 === [INPUT_CANCEL, INPUT_END].indexOf(input.eventType) && (COMPUTE_INTERVAL < deltaTime || undefined === $store.get('direction'))) {
                var deltaX = input.x - _prevInput.x;
                var deltaY = input.y - _prevInput.y;
                speedX = Math.round(deltaX / deltaTime * 100) / 100;
                speedY = Math.round(deltaY / deltaTime * 100) / 100;
                velocityX = Math.abs(speedX);
                velocityY = Math.abs(speedY);
                direction = getDirection(deltaX, deltaY) || ($store.get('direction'));
                $store.set({ speedX: speedX });
                $store.set({ speedY: speedY });
                $store.set({ velocityX: velocityX });
                $store.set({ velocityY: velocityY });
                $store.set({ direction: direction });
            }
            else {
                speedX = $store.get('speedX', 0);
                speedY = $store.get('speedY', 0);
                velocityX = $store.get('velocityX', 0);
                velocityY = $store.get('velocityY', 0);
                direction = $store.get('direction');
            }
        }
        return { velocityX: velocityX, velocityY: velocityY, speedX: speedX, speedY: speedY, direction: direction };
    });

    function computeDistance (_a, $store) {
        var startInput = _a.startInput, input = _a.input;
        var eventType = input.eventType;
        var displacementX = 0;
        var displacementY = 0;
        if ('start' === eventType) {
            $store.set({ displacementX: displacementX });
            $store.set({ displacementY: displacementY });
        }
        else if ('move' === eventType) {
            displacementX = Math.round(input.points[0][CLIENT_X] - startInput.points[0][CLIENT_X]);
            displacementY = Math.round(input.points[0][CLIENT_Y] - startInput.points[0][CLIENT_Y]);
            $store.set({ displacementX: displacementX });
            $store.set({ displacementY: displacementY });
        }
        else if ('end' === eventType) {
            displacementX = $store.get('displacementX', 0);
            displacementY = $store.get('displacementY', 0);
        }
        var distanceX = Math.abs(displacementX);
        var distanceY = Math.abs(displacementY);
        var distance = Math.round(getVLength({ x: distanceX, y: distanceY }));
        var overallDirection = getDirection(displacementX, displacementY);
        return {
            displacementX: displacementX, displacementY: displacementY, distanceX: distanceX, distanceY: distanceY, distance: distance, overallDirection: overallDirection
        };
    }

    function computeDeltaXY (_a, $store) {
        var prevInput = _a.prevInput, input = _a.input;
        var deltaX;
        var deltaY;
        var deltaXYAngle = 0;
        if (undefined === prevInput) {
            deltaX = 0;
            deltaY = 0;
        }
        else {
            deltaX = input.x - prevInput.x;
            deltaY = input.y - prevInput.y;
        }
        if (0 !== deltaX || 0 !== deltaY) {
            var deltaXY = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));
            deltaXYAngle = Math.round(radianToAngle(Math.acos(Math.abs(deltaX) / deltaXY)));
            $store.set({ deltaXYAngle: deltaXYAngle });
        }
        else {
            deltaXYAngle = $store.get('deltaXYAngle', 0);
        }
        return { deltaX: deltaX, deltaY: deltaY, deltaXYAngle: deltaXYAngle };
    }

    var computeMaxLength = (function (_a, $store) {
        var pointLength = _a.pointLength, isStart = _a.isStart;
        if (isStart) {
            $store.set({ maxPointLength: pointLength });
            return pointLength;
        }
        return $store.get('maxPointLength', 0);
    });

    var computeVector = (function (input) { return ({
        x: input.points[1][CLIENT_X] - input.points[0][CLIENT_X],
        y: input.points[1][CLIENT_Y] - input.points[0][CLIENT_Y]
    }); });

    function computeScale (_a) {
        var startV = _a.startV, prevV = _a.prevV, activeV = _a.activeV;
        var deltaScale = getVLength(activeV) / getVLength(prevV);
        var scale = getVLength(activeV) / getVLength(startV);
        return { scale: scale, deltaScale: deltaScale };
    }

    function computeAngle (_a) {
        var startV = _a.startV, prevV = _a.prevV, activeV = _a.activeV;
        var deltaAngle = getAngle(activeV, prevV);
        var angle = getAngle(activeV, startV);
        return { angle: angle, deltaAngle: deltaAngle };
    }

    function computMulti (_a, $store) {
        var startMultiInput = _a.startMultiInput, prevInput = _a.prevInput, input = _a.input;
        if (undefined !== startMultiInput && undefined !== prevInput && 1 < prevInput.points.length && 1 < input.points.length) {
            var startV = computeVector(startMultiInput);
            var prevV = computeVector(prevInput);
            var activeV = computeVector(input);
            var _b = computeScale({
                startV: startV, activeV: activeV, prevV: prevV
            }), scale = _b.scale, deltaScale = _b.deltaScale;
            var _c = computeAngle({ startV: startV, prevV: prevV, activeV: activeV }), deltaAngle = _c.deltaAngle, angle = _c.angle;
            $store.set({ angle: angle });
            $store.set({ scale: scale });
            return { scale: scale, deltaScale: deltaScale, deltaAngle: deltaAngle, angle: angle };
        }
        else {
            return {
                scale: $store.get('scale', 1),
                deltaScale: 1,
                deltaAngle: 0,
                angle: $store.get('angle', 0)
            };
        }
    }

    function compute (inputs, $store) {
        var input = inputs.input;
        var _a = computeDistance(inputs, $store), displacementX = _a.displacementX, displacementY = _a.displacementY, distanceX = _a.distanceX, distanceY = _a.distanceY, distance = _a.distance, overallDirection = _a.overallDirection;
        var deltaTime = inputs.input.timestamp - inputs.startInput.timestamp;
        var _b = intervalCompute(inputs, $store), velocityX = _b.velocityX, velocityY = _b.velocityY, speedX = _b.speedX, speedY = _b.speedY, direction = _b.direction;
        var _c = computeDeltaXY(inputs, $store), deltaX = _c.deltaX, deltaY = _c.deltaY, deltaXYAngle = _c.deltaXYAngle;
        var _d = computMulti(inputs, $store), scale = _d.scale, deltaScale = _d.deltaScale, angle = _d.angle, deltaAngle = _d.deltaAngle;
        var maxPointLength = computeMaxLength(input, $store);
        return __assign({ type: '' }, input, { velocityX: velocityX,
            velocityY: velocityY,
            speedX: speedX,
            speedY: speedY,
            deltaTime: deltaTime,
            overallDirection: overallDirection,
            direction: direction,
            deltaX: deltaX, deltaY: deltaY, deltaXYAngle: deltaXYAngle,
            displacementX: displacementX,
            displacementY: displacementY,
            distanceX: distanceX,
            distanceY: distanceY,
            distance: distance,
            scale: scale,
            deltaScale: deltaScale,
            angle: angle,
            deltaAngle: deltaAngle,
            maxPointLength: maxPointLength });
    }

    var default_1$4 = (function () {
        function default_1(_a) {
            var $store = _a.$store;
            this.inputFactory = new default_1$3();
            this.$store = $store;
        }
        default_1.prototype.load = function (event) {
            var input = this.inputFactory.load(event);
            if (undefined === input)
                return;
            var record = this._record(input);
            return compute(record, this.$store);
        };
        default_1.prototype._record = function (input) {
            var eventType = input.eventType;
            this.prevInput = this.activeInput;
            if (INPUT_START === eventType) {
                if (input.isStart) {
                    this.startInput = input;
                }
                if (1 < input.pointLength) {
                    this.startMultiInput = input;
                }
                else {
                    this.startMultiInput = undefined;
                }
            }
            this.activeInput = input;
            return {
                startMultiInput: this.startMultiInput,
                startInput: this.startInput,
                prevInput: this.prevInput,
                input: input
            };
        };
        return default_1;
    }());

    var computeTouchAction = (function (touchActions) {
        var _a, e_1, _b;
        var TOUCH_ACTION_PRIORITY = (_a = {},
            _a[AUTO] = 0,
            _a[MANIPULATION] = 1,
            _a[PAN_X] = 2,
            _a[PAN_Y] = 2,
            _a[NONE] = 3,
            _a);
        var MAX_PRIORITY = TOUCH_ACTION_PRIORITY[NONE];
        var touchActionCSSArray = [AUTO];
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
                if (touchActions_1_1 && !touchActions_1_1.done && (_b = touchActions_1.return)) _b.call(touchActions_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return touchActionCSSArray.join(' ');
    });

    var default_1$5 = (function () {
        function default_1() {
            this.store = {};
        }
        default_1.prototype.set = function (object) {
            this.store = __assign({}, this.store, object);
        };
        default_1.prototype.get = function (key, defaultValue) {
            return this.store[key] || defaultValue;
        };
        default_1.prototype.reset = function () {
            this.store = {};
        };
        default_1.prototype.destroy = function () {
            this.reset();
        };
        return default_1;
    }());

    var STATUS_POSSIBLE = 'possible';
    var STATUS_START = 'start';
    var STATUS_MOVE = 'move';
    var STATUS_END = 'end';
    var STATUS_CANCELLED = 'cancel';
    var STATUS_FAILED = 'failed';
    var STATUS_RECOGNIZED = 'recognized';

    var Recognizer = (function () {
        function Recognizer(options) {
            this.options = __assign({}, this.constructor.DEFAULT_OPTIONS, { disabled: false }, options);
            this.name = this.options.name;
            this.disabled = this.options.disabled;
            this.status = STATUS_POSSIBLE;
            this.isRecognized = false;
            this.requireFailureRecognizers = [];
            this.isWaitingOther = false;
        }
        Recognizer.prototype.set = function (options) {
            if (options === void 0) { options = {}; }
            this.options = __assign({}, this.options, options);
            this.$root.update();
            return this;
        };
        Recognizer.prototype.$injectRoot = function ($root) {
            this.$root = $root;
            return this;
        };
        Recognizer.prototype.emit = function (type, payload) {
            payload.type = type;
            this.$root.eventEmitter.emit(type, payload);
            if (undefined !== this.$root.el) {
                if (this.$root.options.syncToAttr) {
                    this.$root.el.setAttribute('at-gesture', type);
                }
                if (this.$root.options.hasDomEvents) {
                    var target = payload.target, currentTarget = payload.currentTarget, type_1 = payload.type, data = __rest(payload, ["target", "currentTarget", "type"]);
                    var event = new Event(type_1, payload);
                    Object.assign(event, data);
                    this.$root.el.dispatchEvent(event);
                }
            }
        };
        Recognizer.prototype.requireFailure = function (recognizer) {
            if (!this.requireFailureRecognizers.includes(recognizer)) {
                this.requireFailureRecognizers.push(recognizer);
            }
        };
        Recognizer.prototype.removeRequireFailure = function (recognizer) {
            var e_1, _a;
            try {
                for (var _b = __values(this.requireFailureRecognizers.entries()), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var _d = __read(_c.value, 2), index = _d[0], requireFailureRecognizer = _d[1];
                    if (requireFailureRecognizer.name === recognizer.name) {
                        this.requireFailureRecognizers.splice(index, 1);
                        break;
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
        };
        Recognizer.prototype.hasRequireFailure = function () {
            return 0 < this.requireFailureRecognizers.length;
        };
        Recognizer.prototype.isAllRequireFailureRecognizersDisabled = function () {
            return this.requireFailureRecognizers.every(function (recognizer) { return recognizer.disabled; });
        };
        Recognizer.prototype.isAllRequiresFailedOrPossible = function () {
            var e_2, _a;
            try {
                for (var _b = __values(this.requireFailureRecognizers), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var recognizer = _c.value;
                    if (recognizer.isWaitingOther)
                        return false;
                    if (STATUS_FAILED !== recognizer.status && STATUS_POSSIBLE !== recognizer.status) {
                        return false;
                    }
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_2) throw e_2.error; }
            }
            return true;
        };
        Recognizer.prototype.isValidPointLength = function (pointLength) {
            return 0 === this.options.pointLength || this.options.pointLength === pointLength;
        };
        Recognizer.prototype.isOnlyHorizontal = function () {
            var e_3, _a;
            var isOnlyHorizontal = true;
            try {
                for (var _b = __values(this.options.directions), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var direction = _c.value;
                    isOnlyHorizontal = -1 < DIRECTION_X.indexOf(direction);
                    if (!isOnlyHorizontal) {
                        return false;
                    }
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_3) throw e_3.error; }
            }
            return isOnlyHorizontal;
        };
        Recognizer.prototype.isOnlyVertical = function () {
            var e_4, _a;
            var isOnlyVertical = true;
            try {
                for (var _b = __values(this.options.directions), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var direction = _c.value;
                    isOnlyVertical = -1 < DIRECTION_Y.indexOf(direction);
                    if (!isOnlyVertical) {
                        return false;
                    }
                }
            }
            catch (e_4_1) { e_4 = { error: e_4_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_4) throw e_4.error; }
            }
            return isOnlyVertical;
        };
        Recognizer.prototype.isVaildDirection = function (direction) {
            return -1 !== this.options.directions.indexOf(direction) || NONE === direction;
        };
        Recognizer.prototype.flow = function (isVaild, activeStatus, touchDevice) {
            var _a, _b, _c, _d, _e, _f, _g;
            var STATE_MAP = {
                1: (_a = {},
                    _a[STATUS_POSSIBLE] = (_b = {},
                        _b[INPUT_MOVE] = STATUS_START,
                        _b[INPUT_END] = STATUS_RECOGNIZED,
                        _b[INPUT_CANCEL] = STATUS_CANCELLED,
                        _b),
                    _a[STATUS_START] = (_c = {},
                        _c[INPUT_MOVE] = STATUS_MOVE,
                        _c[INPUT_END] = STATUS_END,
                        _c[INPUT_CANCEL] = STATUS_CANCELLED,
                        _c),
                    _a[STATUS_MOVE] = (_d = {},
                        _d[INPUT_MOVE] = STATUS_MOVE,
                        _d[INPUT_END] = STATUS_END,
                        _d),
                    _a),
                0: (_e = {},
                    _e[STATUS_START] = (_f = {},
                        _f[INPUT_MOVE] = STATUS_CANCELLED,
                        _f[INPUT_END] = STATUS_END,
                        _f[INPUT_CANCEL] = STATUS_CANCELLED,
                        _f),
                    _e[STATUS_MOVE] = (_g = {},
                        _g[INPUT_MOVE] = STATUS_CANCELLED,
                        _g[INPUT_END] = STATUS_END,
                        _g[INPUT_CANCEL] = STATUS_CANCELLED,
                        _g),
                    _e)
            };
            if (undefined !== STATE_MAP[Number(isVaild)][activeStatus]) {
                return STATE_MAP[Number(isVaild)][activeStatus][touchDevice] || activeStatus;
            }
            else {
                return activeStatus;
            }
        };
        Recognizer.prototype._resetStatus = function () {
            if (-1 !== [STATUS_END, STATUS_CANCELLED, STATUS_RECOGNIZED, STATUS_FAILED].indexOf(this.status)) {
                this.status = STATUS_POSSIBLE;
            }
        };
        Recognizer.prototype.recognize = function (computed) {
            var isVaild = this.test(computed);
            this._resetStatus();
            var eventType = computed.eventType;
            this.status = this.flow(isVaild, this.status, eventType);
            if (STATUS_CANCELLED === eventType) {
                this.emit(this.options.name + INPUT_CANCEL, computed);
                return;
            }
            this.isRecognized = -1 < [STATUS_START, STATUS_MOVE, STATUS_END, STATUS_RECOGNIZED].indexOf(this.status);
            if (isVaild) {
                this.afterRecognized(computed);
                this.emit(this.options.name, computed);
                this.emit(this.options.name + this.status, computed);
                this.afterEmit(computed);
            }
            else if (this.isRecognized) {
                this.emit(this.options.name + this.status, computed);
            }
        };
        Recognizer.prototype.afterRecognized = function (computed) { };
        Recognizer.prototype.afterEmit = function (computed) { };
        return Recognizer;
    }());

    var TapRecognizer = (function (_super) {
        __extends(TapRecognizer, _super);
        function TapRecognizer(options) {
            if (options === void 0) { options = {}; }
            var _this = _super.call(this, options) || this;
            _this.tapCount = 0;
            return _this;
        }
        TapRecognizer.prototype.getTouchAction = function () {
            return (1 < this.options.tapTimes) ? ['manipulation'] : [AUTO];
        };
        TapRecognizer.prototype._isValidDistanceFromPrevTap = function (point) {
            if (undefined !== this.prevTapPoint) {
                var distanceFromPreviousTap = getVLength({ x: point.x - this.prevTapPoint.x, y: point.y - this.prevTapPoint.y });
                this.prevTapPoint = point;
                return this.options.tapsPositionTolerance >= distanceFromPreviousTap;
            }
            else {
                this.prevTapPoint = point;
                return true;
            }
        };
        TapRecognizer.prototype._isValidInterval = function () {
            var now = Date.now();
            if (undefined === this.prevTapTime) {
                this.prevTapTime = now;
                return true;
            }
            else {
                var interval = now - this.prevTapTime;
                this.prevTapTime = now;
                return interval < this.options.waitNextTapTime;
            }
        };
        TapRecognizer.prototype.recognize = function (computed) {
            var _this = this;
            if (INPUT_END !== computed.eventType)
                return;
            this.status = STATUS_POSSIBLE;
            if (this.test(computed)) {
                clearTimeout(this._delayFailTimer);
                clearTimeout(this._waitOtherFailedTimer);
                this.isWaitingOther = false;
                if (this._isValidDistanceFromPrevTap(computed) && this._isValidInterval()) {
                    this.tapCount++;
                }
                else {
                    this.tapCount = 1;
                }
                if (0 === this.tapCount % this.options.tapTimes) {
                    if (this.hasRequireFailure() && !this.isAllRequireFailureRecognizersDisabled()) {
                        this.isWaitingOther = true;
                        this._waitOtherFailedTimer = setTimeout(function () {
                            if (_this.isAllRequiresFailedOrPossible()) {
                                _this.status = STATUS_RECOGNIZED;
                                _this.emit(_this.options.name, __assign({}, computed, { tapCount: _this.tapCount }));
                            }
                            else {
                                _this.status = STATUS_FAILED;
                            }
                            _this.isWaitingOther = false;
                        }, this.options.waitNextTapTime);
                    }
                    else {
                        this.status = STATUS_RECOGNIZED;
                        this.emit(this.options.name, __assign({}, computed, { tapCount: this.tapCount }));
                        this.reset();
                    }
                }
                else {
                    this._delayFailTimer = setTimeout(function () {
                        _this.status = STATUS_FAILED;
                        _this.reset();
                    }, this.options.waitNextTapTime);
                }
            }
            else {
                this.reset();
                this.status = STATUS_FAILED;
            }
        };
        TapRecognizer.prototype.reset = function () {
            this.tapCount = 0;
            this.prevTapPoint = undefined;
            this.prevTapTime = undefined;
        };
        TapRecognizer.prototype.test = function (computed) {
            var distance = computed.distance, deltaTime = computed.deltaTime, maxPointLength = computed.maxPointLength;
            return maxPointLength === this.options.pointLength &&
                this.options.positionTolerance >= distance &&
                this.options.maxPressTime > deltaTime;
        };
        TapRecognizer.prototype.afterEmit = function (computed) { };
        TapRecognizer.DEFAULT_OPTIONS = {
            name: 'tap',
            pointLength: 1,
            tapTimes: 1,
            waitNextTapTime: 300,
            disabled: false,
            positionTolerance: 2,
            tapsPositionTolerance: 9,
            maxPressTime: 250,
        };
        return TapRecognizer;
    }(Recognizer));

    var PressRecognizer = (function (_super) {
        __extends(PressRecognizer, _super);
        function PressRecognizer(options) {
            if (options === void 0) { options = {}; }
            return _super.call(this, options) || this;
        }
        PressRecognizer.prototype.getTouchAction = function () {
            return [AUTO];
        };
        PressRecognizer.prototype.recognize = function (computed) {
            var _this = this;
            var eventType = computed.eventType, deltaTime = computed.deltaTime;
            if (INPUT_START === eventType && this.test(computed)) {
                this._resetStatus();
                this.cancel();
                this._timeoutId = setTimeout(function () {
                    _this.status = STATUS_RECOGNIZED;
                    _this.emit(_this.options.name, computed);
                }, this.options.minPressTime);
            }
            else if (INPUT_END === eventType && STATUS_RECOGNIZED === this.status) {
                this.emit("" + this.options.name + DIRECTION_UP, computed);
            }
            else if (!this.test(computed) || (this.options.minPressTime > deltaTime && -1 !== [INPUT_END, INPUT_CANCEL].indexOf(eventType))) {
                this.cancel();
                this.status = STATUS_FAILED;
            }
        };
        PressRecognizer.prototype.test = function (_a) {
            var distance = _a.distance, pointLength = _a.pointLength;
            return this.options.positionTolerance > distance && this.isValidPointLength(pointLength);
        };
        PressRecognizer.prototype.cancel = function () {
            clearTimeout(this._timeoutId);
        };
        PressRecognizer.prototype.afterEmit = function () { };
        PressRecognizer.DEFAULT_OPTIONS = {
            name: 'press',
            pointLength: 1,
            positionTolerance: 9,
            minPressTime: 251,
        };
        return PressRecognizer;
    }(Recognizer));

    var getHV = (function (directions) {
        var e_1, _a;
        var hasHorizontal = false;
        var hasVertical = false;
        try {
            for (var directions_1 = __values(directions), directions_1_1 = directions_1.next(); !directions_1_1.done; directions_1_1 = directions_1.next()) {
                var direction = directions_1_1.value;
                if (-1 < DIRECTION_X.indexOf(direction)) {
                    hasHorizontal = true;
                    if (hasVertical)
                        break;
                }
                else if (-1 < DIRECTION_Y.indexOf(direction)) {
                    hasVertical = true;
                    if (hasHorizontal)
                        break;
                }
                else {
                    throw new Error(WRONG_DIRECTION);
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (directions_1_1 && !directions_1_1.done && (_a = directions_1.return)) _a.call(directions_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return { hasHorizontal: hasHorizontal, hasVertical: hasVertical };
    });

    var PanRecognizer = (function (_super) {
        __extends(PanRecognizer, _super);
        function PanRecognizer(options) {
            if (options === void 0) { options = {}; }
            return _super.call(this, options) || this;
        }
        PanRecognizer.prototype.getTouchAction = function () {
            var touchActions = [AUTO];
            var _a = getHV(this.options.directions), hasHorizontal = _a.hasHorizontal, hasVertical = _a.hasVertical;
            if (hasHorizontal && hasVertical) {
                touchActions = [NONE];
            }
            else if (!hasHorizontal && hasVertical) {
                touchActions = [PAN_X];
            }
            else if (!hasVertical && hasHorizontal) {
                touchActions = [PAN_Y];
            }
            return touchActions;
        };
        PanRecognizer.prototype.test = function (_a) {
            var distance = _a.distance, direction = _a.direction, eventType = _a.eventType, pointLength = _a.pointLength;
            return INPUT_MOVE === eventType &&
                (this.isRecognized || this.options.threshold < distance) &&
                this.isValidPointLength(pointLength) &&
                this.isVaildDirection(direction);
        };
        PanRecognizer.prototype.afterEmit = function (computed) {
            if (NONE !== computed.direction) {
                this.emit(this.options.name + computed.direction, computed);
            }
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
                if (DIRECTION_LEFT === direction && 0 > computed.deltaX) {
                    deltaX = computed.deltaX;
                }
                else if (DIRECTION_RIGHT === direction && 0 < computed.deltaX) {
                    deltaX = computed.deltaX;
                }
                else if (DIRECTION_DOWN === direction && 0 < computed.deltaY) {
                    deltaY = computed.deltaY;
                }
                else if (DIRECTION_UP === direction && 0 > computed.deltaY) {
                    deltaY = computed.deltaY;
                }
            });
            computed.deltaX = deltaX;
            computed.deltaY = deltaY;
            return computed;
        };
        PanRecognizer.DEFAULT_OPTIONS = {
            name: 'pan',
            threshold: 10,
            pointLength: 1,
            directions: DIRECTION_ALL
        };
        return PanRecognizer;
    }(Recognizer));

    var SwipeRecognizer = (function (_super) {
        __extends(SwipeRecognizer, _super);
        function SwipeRecognizer(options) {
            if (options === void 0) { options = {}; }
            return _super.call(this, options) || this;
        }
        SwipeRecognizer.prototype.getTouchAction = function () {
            return [NONE];
        };
        SwipeRecognizer.prototype.afterEmit = function (computed) {
            if (NONE !== computed.direction) {
                this.emit(this.options.name + computed.direction, computed);
            }
        };
        SwipeRecognizer.prototype.test = function (computed) {
            if (INPUT_END !== computed.eventType)
                return false;
            var direction = computed.direction, velocityX = computed.velocityX, velocityY = computed.velocityY, maxPointLength = computed.maxPointLength, distance = computed.distance;
            var vaildVelocityX = velocityX;
            var vaildVelocityY = velocityY;
            if (this.isOnlyHorizontal()) {
                vaildVelocityY = 0;
            }
            else if (this.isOnlyVertical()) {
                vaildVelocityX = 0;
            }
            var vaildVelocity = Math.sqrt(vaildVelocityX * vaildVelocityX + vaildVelocityY * vaildVelocityY);
            return 1 === maxPointLength &&
                this.options.threshold < distance &&
                this.isVaildDirection(direction) &&
                this.options.velocity < vaildVelocity;
        };
        SwipeRecognizer.DEFAULT_OPTIONS = {
            name: 'swipe',
            threshold: 10,
            velocity: 0.3,
            pointLength: 1,
            directions: DIRECTION_ALL
        };
        return SwipeRecognizer;
    }(Recognizer));

    var PinchRecognizer = (function (_super) {
        __extends(PinchRecognizer, _super);
        function PinchRecognizer(options) {
            if (options === void 0) { options = {}; }
            var _this = _super.call(this, options) || this;
            _this._prevScale = 1;
            return _this;
        }
        PinchRecognizer.prototype.getTouchAction = function () {
            return [NONE];
        };
        PinchRecognizer.prototype.afterEmit = function (computed) {
            if (INPUT_END === computed.eventType)
                return;
            var scale = computed.scale;
            if (1 !== scale) {
                var inOrOut = scale > this._prevScale ? 'out' : 'in';
                this.emit(this.options.name + inOrOut, computed);
            }
            this._prevScale = scale;
        };
        PinchRecognizer.prototype.test = function (_a) {
            var pointLength = _a.pointLength, scale = _a.scale;
            return this.isValidPointLength(pointLength) && (this.options.threshold < Math.abs(scale - 1) || this.isRecognized);
        };
        PinchRecognizer.DEFAULT_OPTIONS = {
            name: 'pinch',
            threshold: 0,
            pointLength: 2,
        };
        return PinchRecognizer;
    }(Recognizer));

    var RotateRecognizer = (function (_super) {
        __extends(RotateRecognizer, _super);
        function RotateRecognizer(options) {
            if (options === void 0) { options = {}; }
            return _super.call(this, options) || this;
        }
        RotateRecognizer.prototype.getTouchAction = function () {
            return [NONE];
        };
        RotateRecognizer.prototype.afterEmit = function (computed) { };
        RotateRecognizer.prototype.test = function (_a) {
            var pointLength = _a.pointLength, angle = _a.angle;
            return this.isValidPointLength(pointLength) && (this.options.threshold < Math.abs(angle) || this.isRecognized);
        };
        RotateRecognizer.DEFAULT_OPTIONS = {
            name: 'rotate',
            threshold: 0,
            pointLength: 2,
        };
        return RotateRecognizer;
    }(Recognizer));

    var default_1$6 = (function () {
        function default_1(el, options) {
            this.default = {
                touchAction: COMPUTE,
                hasDomEvents: true,
                isPreventDefault: true,
                syncToAttr: false,
                cssPrevent: {
                    selectText: true,
                    drag: true,
                    tapHighlight: true,
                    callout: true
                }
            };
            if (undefined !== el)
                this.el = el;
            this.$store = new default_1$5();
            this.inputManage = new default_1$4({ $store: this.$store });
            this.touchDevice = SUPPORT_TOUCH ? TOUCH : MOUSE;
            this.options = __assign({}, this.default, options);
            this.eventEmitter = new AnyEvent();
            this._isStopped = false;
            var root = { eventEmitter: this.eventEmitter, options: this.options, el: el, update: this.update.bind(this) };
            this._root = root;
            this.recognizers = [
                new RotateRecognizer().$injectRoot(root),
                new PinchRecognizer().$injectRoot(root),
                new PanRecognizer().$injectRoot(root),
                new SwipeRecognizer().$injectRoot(root),
                new TapRecognizer().$injectRoot(root),
                new TapRecognizer({
                    name: 'doubletap',
                    pointLength: 1,
                    tapTimes: 2,
                    disabled: true
                }).$injectRoot(root),
                new PressRecognizer().$injectRoot(root),
            ];
            this.recognizers[4].requireFailure(this.recognizers[5]);
            if (undefined !== this.el) {
                this.update();
                this._unbindEl = this._bindEL(this.el)._unbindEl;
            }
        }
        default_1.prototype.updateTouchAction = function () {
            var e_1, _a;
            if (COMPUTE === this.options.touchAction) {
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
                        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
                this.el.style.touchAction = computeTouchAction(touchActions);
            }
            else {
                this.el.style.touchAction = this.options.touchAction || AUTO;
            }
        };
        default_1.prototype.updateCssPrevent = function () {
            var style = {};
            var cssPrevent = this.options.cssPrevent;
            if (undefined === cssPrevent)
                return;
            if (cssPrevent.selectText) {
                style['mozUserSelect'] = NONE;
                style['userSelect'] = NONE;
                style['msUserSelect'] = NONE;
                style['webkitUserSelect'] = NONE;
                style['msTouchSelect'] = NONE;
            }
            if (cssPrevent.drag) {
                style['webkitUserDrag'] = NONE;
            }
            if (cssPrevent.tapHighlight) {
                style['webkitTapHighlightColor'] = 'rgba(0,0,0,0)';
            }
            if (cssPrevent.callout) {
                style['webkitTouchCallout'] = NONE;
            }
            for (var k in style) {
                this.el.style[k] = style[k];
            }
        };
        default_1.prototype.update = function () {
            if (undefined === this.el)
                return;
            this.updateTouchAction();
            this.updateCssPrevent();
        };
        default_1.prototype._bindEL = function (el) {
            var boundInputListener = this.inputListener.bind(this);
            if (TOUCH === this.touchDevice) {
                var events_1 = [TOUCH_START, TOUCH_MOVE, TOUCH_END, TOUCH_CANCEL];
                events_1.forEach(function (eventName) {
                    el.addEventListener(eventName, boundInputListener);
                });
                return {
                    _unbindEl: function () {
                        events_1.forEach(function (eventName) {
                            el.removeEventListener(eventName, boundInputListener);
                        });
                    }
                };
            }
            else {
                el.addEventListener(MOUSE_DOWN, boundInputListener);
                window.addEventListener(MOUSE_MOVE, boundInputListener);
                window.addEventListener(MOUSE_UP, boundInputListener);
                return {
                    _unbindEl: function () {
                        el.removeEventListener(MOUSE_DOWN, boundInputListener);
                        window.removeEventListener(MOUSE_MOVE, boundInputListener);
                        window.removeEventListener(MOUSE_UP, boundInputListener);
                    }
                };
            }
        };
        default_1.prototype.catchEvent = function (event) {
            this.inputListener(event);
        };
        default_1.prototype.add = function (recognizer) {
            recognizer.$injectRoot(this._root);
            var hasSameName = this.recognizers.some(function (theRecognizer) { return recognizer.name === theRecognizer.name; });
            if (hasSameName) {
                this.eventEmitter.emit('error', { code: 1, message: recognizer.name + "\u8BC6\u522B\u5668\u5DF2\u7ECF\u5B58\u5728!" });
            }
            else {
                this.recognizers.push(recognizer);
                this.update();
            }
        };
        default_1.prototype.get = function (name) {
            return this.recognizers.find(function (recognizer) { return name === recognizer.options.name; });
        };
        default_1.prototype.set = function (options) {
            this.options = __assign({}, this.default, options);
            this.update();
        };
        default_1.prototype.stop = function () {
            this._isStopped = true;
        };
        default_1.prototype.remove = function (recognizerName) {
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
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_2) throw e_2.error; }
            }
        };
        default_1.prototype.inputListener = function (event) {
            var e_3, _a;
            if (this.options.isPreventDefault) {
                event.preventDefault();
            }
            var computed = this.inputManage.load(event);
            if (undefined !== computed) {
                this.emit('input', computed);
                if (computed.isStart) {
                    this._isStopped = false;
                }
                try {
                    for (var _b = __values(this.recognizers), _c = _b.next(); !_c.done; _c = _b.next()) {
                        var recognizer = _c.value;
                        if (recognizer.disabled)
                            continue;
                        recognizer.recognize(computed);
                        if (this._isStopped) {
                            break;
                        }
                    }
                }
                catch (e_3_1) { e_3 = { error: e_3_1 }; }
                finally {
                    try {
                        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                    }
                    finally { if (e_3) throw e_3.error; }
                }
            }
        };
        default_1.prototype.on = function (type, listener, options) {
            if (options === void 0) { options = false; }
            this.eventEmitter.on(type, listener);
        };
        default_1.prototype.off = function (type, listener) {
            this.eventEmitter.off(type, listener);
        };
        default_1.prototype.emit = function (type, payload) {
            this.eventEmitter.emit(type, __assign({}, payload, { type: type }));
        };
        default_1.prototype._unbindEl = function () { };
        default_1.prototype.destroy = function () {
            this.$store.destroy();
            if (this.el) {
                this._unbindEl();
            }
            this.eventEmitter.destroy();
        };
        default_1.Tap = TapRecognizer;
        default_1.Press = PressRecognizer;
        default_1.Pan = PanRecognizer;
        default_1.Swipe = SwipeRecognizer;
        default_1.Pinch = PinchRecognizer;
        default_1.Rotate = RotateRecognizer;
        default_1.version = '0.4.10';
        default_1.Vector = Vector;
        default_1.EventEmitter = AnyEvent;
        return default_1;
    }());

    return default_1$6;

}());
