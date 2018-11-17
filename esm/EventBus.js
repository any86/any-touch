"use strict";
exports.__esModule = true;
;
;
var EventBus = (function () {
    function EventBus(targetElement) {
        if (targetElement === void 0) { targetElement = document; }
        this._stack = {};
        this.targetElement = targetElement;
    }
    ;
    EventBus.prototype.el = function (targetElement) {
        if (targetElement === void 0) { targetElement = document; }
        this.targetElement = targetElement;
        return this;
    };
    ;
    EventBus.prototype.emit = function (eventName, payload) {
        if (undefined !== this._stack[eventName]) {
            var callbacks = this._stack[eventName];
            callbacks.forEach(function (callback) {
                callback(payload);
            });
            var event_1 = new CustomEvent(eventName, {
                detail: payload,
                bubbles: true,
                cancelable: true
            });
            this.targetElement.dispatchEvent(event_1);
        }
    };
    ;
    EventBus.prototype.on = function (eventName, callback) {
        if (undefined === this._stack[eventName]) {
            this._stack[eventName] = [];
        }
        ;
        this._stack[eventName].push(callback);
    };
    ;
    EventBus.prototype.off = function (eventName, callback) {
        var events = this._stack[eventName];
        if (undefined === callback) {
            this._stack[eventName] = [];
        }
        else {
            for (var i = 0, len = events.length; i < len; i++) {
                var existCallback = events[i];
                if (existCallback === callback) {
                    events.splice(i, 1);
                    break;
                }
            }
        }
    };
    ;
    EventBus.prototype.has = function (eventName) {
        return undefined !== this._stack[eventName];
    };
    return EventBus;
}());
exports["default"] = EventBus;
;
//# sourceMappingURL=EventBus.js.map