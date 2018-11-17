"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var create_1 = __importDefault(require("./input/create"));
var startInput;
var prevInput;
var activeInput;
var startMutliInput;
exports["default"] = (function (event) {
    var input = create_1["default"](event);
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