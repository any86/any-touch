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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var Base_1 = __importDefault(require("./Base"));
var PressRecognizer = (function (_super) {
    __extends(PressRecognizer, _super);
    function PressRecognizer(options) {
        if (options === void 0) { options = { pointerLength: 1 }; }
        var _this = _super.call(this, options) || this;
        _this._timeoutId = null;
        return _this;
    }
    ;
    PressRecognizer.prototype.recognize = function (computed) {
        var _this = this;
        var inputStatus = computed.inputStatus, distance = computed.distance, duration = computed.duration;
        if (this.test(computed)) {
            if ('start' === inputStatus) {
                this._timeoutId = window.setTimeout(function () {
                    _this.emit(_this.options.name, computed);
                }, 250);
            }
            else if ('move' === inputStatus) {
                if (9 < distance) {
                    this.cancel();
                }
            }
            else if ('end' === inputStatus) {
                if (251 > duration || 9 < distance) {
                    this.cancel();
                }
                else {
                    this.emit(this.options.name + "up", computed);
                }
            }
        }
        else {
            this.cancel();
        }
    };
    ;
    PressRecognizer.prototype.test = function (_a) {
        var pointerLength = _a.pointerLength;
        return 1 >= pointerLength;
    };
    ;
    PressRecognizer.prototype.cancel = function () {
        clearTimeout(this._timeoutId);
    };
    PressRecognizer.prototype.afterRecognized = function () { };
    return PressRecognizer;
}(Base_1["default"]));
exports["default"] = PressRecognizer;
;
//# sourceMappingURL=Press.js.map