// 事件的回调
interface EventHandler {
    (payload: object): void;
};

// 事件堆栈
interface Stack {
    [propsName: string]: EventHandler[];
};

export default class EventBus {
    private _stack: Stack;
    public targetElement: Element | Document;

    constructor(targetElement: Element | Document = document) {
        this._stack = <Stack>{};
        this.targetElement = targetElement;
    };

    /**
     * 选取绑定事件的元素
     * @param 绑定事件的元素 
     */
    el(targetElement: Element | Document = document) {
        this.targetElement = targetElement;
        return this;
    };

    /**
     * 触发回调
     * @param {String} 事件名
     * @param {Object} 参数
     */
    dispatch(eventName: string, payload: object): void {
        if (undefined !== this._stack[eventName]) {
            const callbacks = this._stack[eventName];
            callbacks.forEach(callback => {
                callback(payload);
            });

            // 创建浏览器事件
            const event = new CustomEvent(eventName, {
                detail: payload,
                bubbles: true,
                cancelable: true
            });
            this.targetElement.dispatchEvent(event);
        }
    };

    /**
     * 注册事件
     * @param {String} 事件名
     * @param {Function} 回调函数
     */
    on(eventName: string, callback: EventHandler) {
        if (undefined === this._stack[eventName]) {
            this._stack[eventName] = [] as EventHandler[];
        };
        this._stack[eventName].push(callback);
    };

    /**
     * 解绑事件
     * @param {String} 事件名 
     * @param {Function} 事件回调
     */
    off(eventName: string, callback: EventHandler) {
        let events = this._stack[eventName];
        if (undefined === callback) {
            events = [];
        } else {
            for (let i = 0, len = events.length; i < len; i++) {
                let existCallback = events[i];
                if (existCallback === callback) {
                    events.splice(i, 1);
                    break;
                }
            }
        }
    };

    /**
     * 判断是否绑定指定事件
     * @param {String} 事件名
     * @return {Boolean} 是否存在
     */
    has(eventName: string): boolean {
        return undefined !== this._stack[eventName];
    }
};