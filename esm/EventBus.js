;
;
export default class EventBus {
    constructor(targetElement = document) {
        this._stack = {};
        this.targetElement = targetElement;
    }
    ;
    el(targetElement = document) {
        this.targetElement = targetElement;
        return this;
    }
    ;
    dispatch(eventName, payload) {
        if (undefined !== this._stack[eventName]) {
            const callbacks = this._stack[eventName];
            callbacks.forEach(callback => {
                callback(payload);
            });
            const event = new CustomEvent(eventName, {
                detail: payload,
                bubbles: true,
                cancelable: true
            });
            this.targetElement.dispatchEvent(event);
        }
    }
    ;
    on(eventName, callback) {
        if (undefined === this._stack[eventName]) {
            this._stack[eventName] = [];
        }
        ;
        this._stack[eventName].push(callback);
    }
    ;
    off(eventName, callback) {
        let events = this._stack[eventName];
        if (undefined === callback) {
            events = [];
        }
        else {
            for (let i = 0, len = events.length; i < len; i++) {
                let existCallback = events[i];
                if (existCallback === callback) {
                    events.splice(i, 1);
                    break;
                }
            }
        }
    }
    ;
    has(eventName) {
        return undefined !== this._stack[eventName];
    }
}
;
