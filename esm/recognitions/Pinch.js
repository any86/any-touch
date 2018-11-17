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
var PinchRecognizer = (function (_super) {
    __extends(PinchRecognizer, _super);
    function PinchRecognizer(options) {
        var _this = _super.call(this, options) || this;
        _this._prevScale = 1;
        return _this;
    }
    ;
    PinchRecognizer.prototype.afterRecognized = function (computed) {
        var scale = computed.scale;
        if (1 !== scale) {
            var inOrOut = scale > this._prevScale ? 'out' : 'in';
            this.emit(this.options.name + inOrOut, computed);
        }
        this._prevScale = scale;
    };
    ;
    PinchRecognizer.prototype.test = function (_a) {
        var pointerLength = _a.pointerLength, scale = _a.scale;
        return this.isValidPointerLength(pointerLength) && (this.options.threshold < Math.abs(scale - 1) || this.isRecognized);
    };
    ;
    return PinchRecognizer;
}(Base_1["default"]));
exports["default"] = PinchRecognizer;
;
PinchRecognizer.prototype.defaultOptions = {
    name: 'pinch',
    threshold: 0,
    pointerLength: 1
};
//# sourceMappingURL=Pinch.js.map