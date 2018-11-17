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
;
var PanRecognizer = (function (_super) {
    __extends(PanRecognizer, _super);
    function PanRecognizer(options) {
        return _super.call(this, options) || this;
    }
    ;
    PanRecognizer.prototype.test = function (_a) {
        var distance = _a.distance, direction = _a.direction, inputStatus = _a.inputStatus, pointerLength = _a.pointerLength;
        var isValidDirection = -1 !== this.options.directions.indexOf(direction);
        var isValidThreshold = this.options.threshold < distance;
        return this.isValidPointerLength(pointerLength) && isValidDirection &&
            (this.isRecognized || isValidThreshold) && 'move' === inputStatus;
    };
    ;
    PanRecognizer.prototype.afterRecognized = function (computed) {
        this.emit(this.options.name + computed.direction, computed);
    };
    return PanRecognizer;
}(Base_1["default"]));
exports["default"] = PanRecognizer;
;
PanRecognizer.prototype.defaultOptions = {
    name: 'pan',
    threshold: 10,
    pointerLength: 1,
    directions: ['up', 'right', 'down', 'left']
};
//# sourceMappingURL=Pan.js.map