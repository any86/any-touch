type Listener = ((...payload: any) => void) & { isOnce?: boolean }

interface ListenersMap {
    [propName: string]: Listener[];
}
export default class AnyEvent {
    private _listenersMap: ListenersMap;

    constructor() {
        this._listenersMap = {};
    };

    /**
     * 绑定事件
     * @param {String|Symbol} 事件名
     * @param {Function} 回调函数
     */
    on(eventName: string, listener: Listener): AnyEvent {
        if (undefined === this._listenersMap[eventName]) {
            this._listenersMap[eventName] = [];
        }
        this._listenersMap[eventName].push(listener);
        return this;
    };

    /**
     * 添加单次监听器 listener 到名为 eventName 的事件。 
     * 当 eventName 事件下次触发时，监听器会先被移除，然后再调用。
     * @param {String|Symbol} 事件名
     * @param {Function} 回调函数
     */
    once(eventName: string, listener: Listener): AnyEvent {
        listener.isOnce = true;
        this.on(eventName, listener);
        return this;
    };

    /**
     * 解除绑定 
     * 如果不指定listener, 那么解除所有eventName对应回调
     * @param {String|Symbol} 事件名
     * @param {Function} 回调函数
     */
    off(eventName: string, listener?: Listener): AnyEvent {
        const listeners = this._listenersMap[eventName];
        // 事件存在
        if (undefined !== listeners) {
            // 清空事件名对应的所有回调
            if (undefined === listener) {
                delete this._listenersMap[eventName];
            }
            // 清空指定回调
            else {
                const index = listeners.findIndex((fn: Listener) => fn === listener);
                listeners.splice(index, 1);
            }
        }
        return this;
    };



    /**
     * 按照监听器注册的顺序，同步地调用每个注册到名为 eventName 的事件的监听器，并传入提供的参数。
     * @param {String|Symbol} 事件名 
     * @param {Any} 载荷数据 
     * @returns {Boolean} 如果事件有监听器，则返回 true，否则返回 false。
     */
    emit(eventName: string, ...payload: any): boolean {
        const listeners = this._listenersMap[eventName];
        if (undefined !== listeners && 0 < listeners.length) {
            for (let [index, listener] of listeners.entries()) {
                if (listener.isOnce) {
                    let listenerClone = listener;
                    listeners.splice(index, 1);
                    listenerClone(...payload);
                } else {
                    listener(...payload);
                }
            }
            return true;
        } else {
            return false;
        }
    };

    /**
     * 检查是否已绑定事件
     * @param {String|Symbol} 事件名
     * @returns {Boolean} 是否已绑定
     */
    has(eventName: string): boolean {
        return undefined !== this._listenersMap[eventName] && 0 < this._listenersMap[eventName].length;
    };

    /**
     * 返回所有事件名称
     */
    getEventNames() {
        const eventNames: string[] = [];
        for (let eventName in this._listenersMap) {
            eventNames.push(eventName);
        }
        return eventNames;
    };

    /**
     * getEventNames别名, 为了和node的api一致
     */
    eventNames() {
        return this.getEventNames();
    }

    /**
     * 销毁实例
     */
    destroy() {
        this._listenersMap = {};
    };
};