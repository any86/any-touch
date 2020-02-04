
export interface Listener {
    (...payload: any): void;
    targets?: HTMLElement[];
}

export interface ListenersMap {
    [propName: string]: Listener[];
}
export default class AnyEvent {
    callbackMap: ListenersMap;
    targets: HTMLElement[];
    constructor() {
        this.callbackMap = {};
        this.targets = [];
    };

    target(el: HTMLElement | HTMLCollection) {
        const targets = Array.isArray(el) ? Array.from(el) : [el];
        this.targets.push(...targets);
        return {
            on: (eventName: string, listener: Listener): void => {
                this.on(eventName, listener, { targets });
            }
        };
    };

    /**
     * 绑定事件
     * @param {String|Symbol} 事件名
     * @param {Function} 回调函数
     */
    on(eventName: string, listener: Listener, { targets }: { targets?: HTMLElement[] } = {}): void {
        if (void 0 === this.callbackMap[eventName]) {
            this.callbackMap[eventName] = [];
        }
        //  备注targets信息
        if (void 0 !== targets) {
            listener.targets = targets;
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
        const listeners = this.callbackMap[eventName];
        const { target } = payload || {};
        if (void 0 !== listeners && 0 < listeners.length) {
            for (const listener of listeners) {
                const { targets } = listener;
                if (void 0 !== target
                    && void 0 !== targets
                    && findRealTargetEl(targets, target)
                ) {
                    listener(payload);
                }
                // 没有绑定targets
                else if (void 0 === targets) {
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

function findRealTargetEl(targetEls: HTMLElement[], target: HTMLElement) {
    // 构造函数绑定的根元素或者target指定的元素
    // 如果使用了target方法
    // 那么realTarget指向target传入的元素
    let realTarget: HTMLElement | undefined;
    if (void 0 !== targetEls) {
        for (const targetEl of targetEls) {
            if (targetEl.contains(target)) {
                realTarget = targetEl;
                break;
            }
        }
    }
    return realTarget;
}
