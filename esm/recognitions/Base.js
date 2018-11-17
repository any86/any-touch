"use strict";
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
exports.__esModule = true;
var recognizerStatus_1 = require("../const/recognizerStatus");
var Recognizer = (function () {
    function Recognizer(options) {
        this.options = __assign({}, this.defaultOptions, options);
        this.status = recognizerStatus_1.STATUS_POSSIBLE;
        this.isRecognized = false;
        this.requireFailureRecognizers = [];
    }
    ;
    Recognizer.prototype.injectEmit = function (emit) {
        this._injectedEmit = emit;
    };
    ;
    Recognizer.prototype.emit = function (type, payload) {
        payload.type = type;
        this._injectedEmit(type, payload);
    };
    ;
    Recognizer.prototype.requireFailure = function (recognizer) {
        if (!this.requireFailureRecognizers.includes(recognizer)) {
            this.requireFailureRecognizers.push(recognizer);
        }
    };
    ;
    Recognizer.prototype.hasRequireFailure = function () {
        return 0 < this.requireFailureRecognizers.length;
    };
    ;
    Recognizer.prototype.isTheOtherFail = function () {
        var length = this.requireFailureRecognizers.length;
        for (var index = 0; index < length; index++) {
            var recognizer = this.requireFailureRecognizers[index];
            if (recognizerStatus_1.STATUS_FAILED !== recognizer.status && recognizerStatus_1.STATUS_POSSIBLE !== recognizer.status) {
                return false;
            }
        }
        ;
        return true;
    };
    ;
    Recognizer.prototype.isValidPointerLength = function (pointerLength) {
        return 0 === this.options.pointerLength || this.options.pointerLength === pointerLength;
    };
    ;
    Recognizer.prototype.isOnlyHorizontal = function () {
        var isOnlyHorizontal = true;
        for (var _i = 0, _a = this.options.directions; _i < _a.length; _i++) {
            var direction = _a[_i];
            isOnlyHorizontal = -1 < ['left', 'right'].indexOf(direction);
            if (!isOnlyHorizontal) {
                return false;
            }
        }
    };
    ;
    Recognizer.prototype.isOnlyVertical = function () {
        var isOnlyVertical = true;
        for (var _i = 0, _a = this.options.directions; _i < _a.length; _i++) {
            var direction = _a[_i];
            isOnlyVertical = -1 < ['up', 'down'].indexOf(direction);
            if (!isOnlyVertical) {
                return false;
            }
        }
    };
    ;
    Recognizer.prototype.isVaildDirection = function (direction) {
        return -1 < this.options.directions.indexOf(direction);
    };
    ;
    Recognizer.prototype.recognize = function (computed) {
        var inputStatus = computed.inputStatus;
        var isVaild = this.test(computed);
        if (-1 < [recognizerStatus_1.STATUS_END, recognizerStatus_1.STATUS_CANCELLED, recognizerStatus_1.STATUS_FAILED, recognizerStatus_1.STATUS_RECOGNIZED].indexOf(this.status)) {
            this.status = recognizerStatus_1.STATUS_POSSIBLE;
        }
        ;
        if (!this.isRecognized && !isVaild && recognizerStatus_1.STATUS_POSSIBLE === this.status && 'end' === inputStatus) {
            this.status = recognizerStatus_1.STATUS_FAILED;
        }
        else if (recognizerStatus_1.STATUS_POSSIBLE === this.status && 'end' === inputStatus && isVaild) {
            this.status = recognizerStatus_1.STATUS_RECOGNIZED;
        }
        else if (recognizerStatus_1.STATUS_POSSIBLE === this.status && isVaild) {
            this.status = recognizerStatus_1.STATUS_START;
        }
        else if (this.isRecognized && 'move' === inputStatus) {
            this.status = recognizerStatus_1.STATUS_MOVE;
        }
        else if (this.isRecognized && 'end' === inputStatus) {
            this.status = recognizerStatus_1.STATUS_END;
        }
        else if (this.isRecognized && 'cancel' === inputStatus) {
            this.status = recognizerStatus_1.STATUS_CANCELLED;
        }
        this.isRecognized = -1 < [recognizerStatus_1.STATUS_START, recognizerStatus_1.STATUS_MOVE].indexOf(this.status);
        if (isVaild) {
            this.emit(this.options.name, computed);
        }
        if (-1 < ['start', 'move', 'end', 'recognized'].indexOf(this.status)) {
            this.emit(this.options.name + this.status, computed);
            this.afterRecognized(computed);
        }
    };
    ;
    return Recognizer;
}());
exports["default"] = Recognizer;
;
//# sourceMappingURL=Base.js.map