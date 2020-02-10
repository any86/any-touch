type SupportElement = HTMLElement | SVGElement;

export interface Listener {
    (...payload: any): void;
    target?: SupportElement;
}

export interface ListenersMap {
    [propName: string]: Listener[];
}
export default class AnyEvent {
    callbackMap: ListenersMap = {};
    currentTarget?: SupportElement;


    target(el: HTMLElement) {
        this.currentTarget = el;
        return {
            on: (eventName: string, listener: Listener): void => {
                this.on(eventName, listener, { target: this.currentTarget });
            }
        };
    };

    /**
     * 绑定事件
     * @param {String|Symbol} 事件名
     * @param {Function} 回调函数
     */
    on(eventName: string, listener: Listener, { target }: { target?: SupportElement } = {}): void {
        if (void 0 === this.callbackMap[eventName]) {
            this.callbackMap[eventName] = [];
        }
        //  备注targets信息
        if (void 0 !== target) {
            listener.target = target;
        }
        this.callbackMap[eventName].push(listener);
    };

    /**
     * 解除绑定 
     * 如果不指定listener, 那么解除所有eventName对应回调
     * @param {String|Symbol} 事件名
     * @param {Function} 回调函数
     */
    off(eventName: string, listener?: Listener): void {
        const listeners = this.callbackMap[eventName];
        // 事件存在
        if (void 0 !== listeners) {
            // 清空事件名对应的所有回调
            if (void 0 === listener) {
                delete this.callbackMap[eventName];
            }
            // 清空指定回调
            else {
                const index = listeners.findIndex((fn: Listener) => fn === listener);
                listeners.splice(index, 1);
            }
        }
    };

    /**
     * 按照监听器注册的顺序，同步地调用每个注册到名为 eventName 的事件的监听器，并传入提供的参数。
     * @param {String|Symbol} 事件名 
     * @param {Any} 载荷数据 
     * @returns {Boolean} 如果事件有监听器，则返回 true，否则返回 false。
     */
    emit(eventName: string, payload?: any): boolean {
        Object.freeze(payload);
        const listeners = this.callbackMap[eventName];
        //  触发事件的元素
        const { targets } = payload || {};
        // 一会判断下2个target是否都是一个元素的子元素
        if (void 0 !== listeners && 0 < listeners.length) {

            for (const listener of listeners) {
                const { target: currentTarget } = listener;

                if (void 0 !== currentTarget
                    && void 0 !== targets
                    && targets.every((target: any) => currentTarget.contains(target))
                ) {
                    listener(payload);
                }
                // 没有绑定currentTarget
                else if (void 0 === currentTarget) {
                    listener(payload);
                }
            }
            return true;
        } else {
            return false;
        }
    };

    /**
     * 销毁实例
     */
    destroy() {
        this.callbackMap = {};
    };
};