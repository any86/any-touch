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
var SwipeRecognizer = (function (_super) {
    __extends(SwipeRecognizer, _super);
    function SwipeRecognizer(options) {
        return _super.call(this, options) || this;
    }
    ;
    SwipeRecognizer.prototype.afterRecognized = function (computed) {
        this.emit(this.options.name + computed.lastDirection, computed);
    };
    ;
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
            'end' === inputStatus &&
            this.isVaildDirection(lastDirection) &&
            this.isVaildDirection(lastDirection) &&
            this.options.velocity < vaildVelocity;
    };
    ;
    return SwipeRecognizer;
}(Base_1["default"]));
exports["default"] = SwipeRecognizer;
;
SwipeRecognizer.prototype.defaultOptions = {
    name: 'swipe',
    threshold: 10,
    velocity: 0.3,
    pointerLength: 1,
    directions: ['up', 'right', 'down', 'left']
};
//# sourceMappingURL=Swipe.js.map