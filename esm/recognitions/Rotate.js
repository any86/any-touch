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
var RotateRecognizer = (function (_super) {
    __extends(RotateRecognizer, _super);
    function RotateRecognizer(options) {
        return _super.call(this, options) || this;
    }
    ;
    RotateRecognizer.prototype.afterRecognized = function (computed) { };
    ;
    RotateRecognizer.prototype.test = function (_a) {
        var pointerLength = _a.pointerLength, angle = _a.angle;
        return this.isValidPointerLength(pointerLength) && (this.options.threshold < Math.abs(angle) || this.isRecognized);
    };
    ;
    return RotateRecognizer;
}(Base_1["default"]));
exports["default"] = RotateRecognizer;
;
RotateRecognizer.prototype.defaultOptions = {
    name: 'rotate',
    threshold: 0,
    pointerLength: 1
};
//# sourceMappingURL=Rotate.js.map