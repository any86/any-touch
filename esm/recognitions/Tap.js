"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var recognizerStatus_1 = require("../const/recognizerStatus");
;
var setTimeout = window.setTimeout, clearTimeout = window.clearTimeout;
var Base_1 = __importDefault(require("./Base"));
var TapRecognizer = (function (_super) {
    __extends(TapRecognizer, _super);
    function TapRecognizer(options) {
        var _this = _super.call(this, options) || this;
        _this.tapTimeoutId = null;
        _this.tapCount = 0;
        return _this;
    }
    ;
    TapRecognizer.prototype.recognize = function (computed) {
        var _this = this;
        this.status = recognizerStatus_1.STATUS_POSSIBLE;
        if (this.test(computed)) {
            this.tapCount++;
            var isValidTapCount_1 = this.options.taps === this.tapCount;
            if (this.hasRequireFailure()) {
                this.cancel();
                this.tapTimeoutId = setTimeout(function () {
                    if (isValidTapCount_1 && _this.isTheOtherFail()) {
                        _this.status = recognizerStatus_1.STATUS_RECOGNIZED;
                        _this.emit(_this.options.name, __assign({}, computed, { tapCount: _this.tapCount }));
                    }
                    ;
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
                    _this.status = recognizerStatus_1.STATUS_FAILED;
                    _this.tapCount = 0;
                }, this.options.interval);
            }
        }
    };
    ;
    TapRecognizer.prototype.cancel = function () {
        clearTimeout(this.tapTimeoutId);
    };
    ;
    TapRecognizer.prototype.test = function (computed) {
        var abs = Math.abs, max = Math.max;
        var inputStatus = computed.inputStatus, distance = computed.distance, duration = computed.duration, maxPointerLength = computed.maxPointerLength, centerX = computed.centerX, centerY = computed.centerY;
        this._prevX = centerX;
        this._prevY = centerY;
        var offsetX = abs(centerX - this._prevX);
        var offsetY = abs(centerY - this._prevY);
        var hasMove = 2 < max(offsetX, offsetY);
        return 'end' === inputStatus && 1 === maxPointerLength && 2 > distance && 250 > duration && !hasMove;
    };
    ;
    TapRecognizer.prototype.afterRecognized = function (computed) { };
    return TapRecognizer;
}(Base_1["default"]));
exports["default"] = TapRecognizer;
;
TapRecognizer.prototype.defaultOptions = {
    name: 'tap',
    pointer: 1,
    taps: 1,
    interval: 300
};
//# sourceMappingURL=Tap.js.map