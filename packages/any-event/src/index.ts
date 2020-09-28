export interface Listener<Payload> {
    (a?: Payload, ...payload: any[]): void;
    beforeEmit?: (payload: Payload) => boolean;
}

interface ListenersMap<Payload> {
    [propName: string]: Listener<Payload>[] | void;
}

interface On<Payload> {
    (eventName: string | string[], listener: Listener<Payload>, beforeEmit?: (payload: Payload) => boolean): void;
}

interface Off<Payload> {
    (eventName: string, listener?: Listener<Payload>): void;
}

interface Emit<Payload> {
    (eventName: string, payload?: Payload): void;
}

interface Destroy {
    (): void;
}

export default function AnyEvent<Payload = any>():
    [
        On<Payload>,
        Off<Payload>,
        Emit<Payload>,
        Destroy
    ] {
    let _listenersMap: ListenersMap<Payload> = {};

    /**
     * 绑定事件
     * @param eventName 事件名
     * @param listener 回调函数
     * @param beforeEmit 触发拦截器, 一般用在对on的二次封装
     */
    const on: On<Payload> = function (eventName, listener, beforeEmit) {
        const eventNames = Array.isArray(eventName) ? eventName : [eventName];
        for (const name of eventNames) {
            if (void 0 === _listenersMap[name]) {
                _listenersMap[name] = [];
            }
            listener.beforeEmit = beforeEmit;
            (_listenersMap[name] as Array<Listener<Payload> | undefined>).push(listener);
        }
    };

    /**
     * 按照监听器注册的顺序，同步地调用每个注册到名为 eventName 的事件的监听器，并传入提供的参数。
     * @param eventName 事件名 
     * @param payload 载荷数据 
     * @returns  如果事件有监听器，则返回 true，否则返回 false。
     */
    const emit: Emit<Payload> = function (eventName, payload) {
        const listeners = _listenersMap[eventName];
        if (void 0 !== listeners && 0 < listeners.length) {
            for (const listener of listeners) {
                if (void 0 === listener.beforeEmit) {
                    listener(payload);
                } else if (void 0 !== payload && listener.beforeEmit(payload)) {
                    listener(payload);
                }
            }
        }
    };

    /**
     * 解除绑定,
     * 如果不指定listener, 
     * 那么解除所有eventName对应回调
     * @param eventName 事件名
     * @param listener 回调函数
     */
    const off: Off<Payload> = function (eventName, listener) {
        const listeners = _listenersMap[eventName];
        // 事件存在
        if (void 0 !== listeners) {
            // 清空事件名对应的所有回调
            if (void 0 === listener) {
                delete _listenersMap[eventName];
            }
            // 清空指定回调
            else {
                const index = listeners.findIndex((fn: Listener<Payload>) => fn === listener);
                listeners.splice(index, 1);
            }
        }
    };

    /**
     * 销毁实例
     */
    function destroy() {
        _listenersMap = {};
    };
    return [on, off, emit, destroy];
}