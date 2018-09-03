// 事件的回调
interface Callback {
    (payload: object): void;
};

// 事件堆栈
interface Stack {
    [propsName: string]: Callback[];
};

export default class EventBus {
    private stack: Stack;

    constructor() {
        this.stack = <Stack>{};
    };

    /**
     * 触发回调
     * @param {String} 事件名
     * @param {Object} 参数
     */
    emit(eventName: string, payload: object): void {
        if (undefined !== this.stack[eventName]) {
            const callbacks = this.stack[eventName];
            callbacks.forEach(callback => {
                callback(payload);
            });
        }
    };

    /**
     * 注册事件
     * @param {String} 事件名
     * @param {Function} 回调函数
     */
    on(eventName: string, callback: never) {
        if (undefined === this.stack[eventName]) {
            this.stack[eventName] = [] as Callback[];
        };
        this.stack[eventName].push(callback);
    };

    off(eventName: string, callback: never) {
        let events = this.stack[eventName];
        for (let i = 0, len = events.length; i < len; i++) {
            let existCallback = events[i];
            if (existCallback === callback) {
                events.splice(i, 1);
                break;
            }
        }
    }
};