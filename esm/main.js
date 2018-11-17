"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var const_1 = require("./const");
var EventBus_1 = __importDefault(require("./EventBus"));
var inputManage_1 = __importDefault(require("./inputManage"));
var index_1 = __importDefault(require("./compute/index"));
var Tap_1 = __importDefault(require("./recognitions/Tap"));
var Press_1 = __importDefault(require("./recognitions/Press"));
var Pan_1 = __importDefault(require("./recognitions/Pan"));
var Swipe_1 = __importDefault(require("./recognitions/Swipe"));
var Pinch_1 = __importDefault(require("./recognitions/Pinch"));
var Rotate_1 = __importDefault(require("./recognitions/Rotate"));
var AnyTouch = (function () {
    function AnyTouch(el, _a) {
        _a = {};
        this.version = '0.0.2';
        this.isMobile = const_1.IS_MOBILE;
        this.eventBus = new EventBus_1["default"](el);
        this.recognizers = [
            new Tap_1["default"]({ name: 'tap', pointer: 1, taps: 1 }),
            new Press_1["default"]({ name: 'press' }),
            new Pan_1["default"]({ name: 'pan' }),
            new Swipe_1["default"]({ name: 'swipe' }),
            new Pinch_1["default"]({ name: 'pinch' }),
            new Rotate_1["default"]({ name: 'rotate' }),
        ];
        this.unbinders = this._bindRecognizers(el);
    }
    ;
    AnyTouch.prototype._bindRecognizers = function (el) {
        var boundFn = this.handler.bind(this);
        if (this.isMobile) {
            return ['touchstart', 'touchmove', 'touchend', 'touchcancel'].map(function (eventName) {
                el.addEventListener(eventName, boundFn);
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
    ;
    AnyTouch.prototype.add = function (recognizer) {
        this.recognizers.push(recognizer);
    };
    ;
    AnyTouch.prototype.get = function (name) {
        return this.recognizers.find(function (recognizer) { return name === recognizer.options.name; });
    };
    ;
    AnyTouch.prototype.set = function (_a) {
        _a = {};
    };
    ;
    AnyTouch.prototype.handler = function (event) {
        var _this = this;
        var inputs = inputManage_1["default"](event);
        if (undefined !== inputs) {
            var computed_1 = index_1["default"](inputs);
            this.recognizers.forEach(function (recognizer) {
                recognizer.injectEmit(_this.eventBus.emit.bind(_this.eventBus));
                recognizer.recognize(computed_1);
            });
        }
    };
    ;
    AnyTouch.prototype.on = function (eventName, callback) {
        this.eventBus.on(eventName, callback);
    };
    ;
    AnyTouch.prototype.off = function (eventName, handler) {
        if (handler === void 0) { handler = undefined; }
        this.eventBus.off(eventName, handler);
    };
    ;
    AnyTouch.prototype.headUpperCase = function (str) {
        return str.toLowerCase().replace(/( |^)[a-z]/g, function (L) { return L.toUpperCase(); });
    };
    ;
    AnyTouch.prototype.destroy = function () {
        this.unbinders.forEach(function (unbinder) {
            unbinder();
        });
    };
    ;
    AnyTouch.TapRecognizer = Tap_1["default"];
    AnyTouch.PressRecognizer = Press_1["default"];
    AnyTouch.PanRecognizer = Pan_1["default"];
    AnyTouch.SwipeRecognizer = Swipe_1["default"];
    AnyTouch.PinchRecognizer = Pinch_1["default"];
    AnyTouch.RotateRecognizer = Rotate_1["default"];
    AnyTouch.DIRECTION_NONE = const_1.DIRECTION_NONE;
    AnyTouch.DIRECTION_UP = const_1.DIRECTION_UP;
    AnyTouch.DIRECTION_RIGHT = const_1.DIRECTION_RIGHT;
    AnyTouch.DIRECTION_DOWN = const_1.DIRECTION_DOWN;
    AnyTouch.DIRECTION_LEFT = const_1.DIRECTION_LEFT;
    AnyTouch.DIRECTION_HORIZONTAL = const_1.DIRECTION_LEFT | const_1.DIRECTION_RIGHT;
    AnyTouch.DIRECTION_VERTICAL = const_1.DIRECTION_UP | const_1.DIRECTION_DOWN;
    AnyTouch.DIRECTION_ALL = const_1.DIRECTION_HORIZONTAL | const_1.DIRECTION_VERTICAL;
    return AnyTouch;
}());
exports["default"] = AnyTouch;
//# sourceMappingURL=main.js.map