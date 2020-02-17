type SupportTarget = HTMLElement | SVGElement;

interface Listener {
    (...payload: any): void;
    target?: SupportTarget;
}

interface ListenersMap {
    [propName: string]: Listener[];
}

interface BeforeEachHook {
    (payload: any, next: () => void): void;
}

interface EmitBeforeHook {
    (options?: { target?: SupportTarget }): boolean;
}


export default class {
    listenersMap: ListenersMap = {};
    // beforeEachHook?: BeforeEachHook;

    target(el: HTMLElement) {
        return {
            on: (eventName: string, listener: Listener): void => {
                this.on(eventName, listener, { target: el });
            }
        };
    };

    /**
     * 绑定事件
     * @param {String|Symbol} 事件名
     * @param {Function} 回调函数
     */
    on(eventName: string, listener: Listener, { target }: { target?: SupportTarget } = {}): void {
        if (void 0 === this.listenersMap[eventName]) {
            this.listenersMap[eventName] = [];
        }
        //  备注targets信息
        if (void 0 !== target) {
            listener.target = target;
        }
        this.listenersMap[eventName].push(listener);
    };

    /**
     * 解除绑定 
     * 如果不指定listener, 那么解除所有eventName对应回调
     * @param {String|Symbol} 事件名
     * @param {Function} 回调函数
     */
    off(eventName: string, listener?: Listener): void {
        const listeners = this.listenersMap[eventName];
        // 事件存在
        if (void 0 !== listeners) {
            // 清空事件名对应的所有回调
            if (void 0 === listener) {
                delete this.listenersMap[eventName];
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
    emit(eventName: string, payload?: any, beforeHook: EmitBeforeHook = () => true): void {
        const listeners = this.listenersMap[eventName];
        
        if (void 0 !== listeners && 0 < listeners.length) {
            for (const listener of listeners) {
                const { target } = listener;
                // 自己的钩子
                // 暂时传target
                // 实际应该传如on的第三个参数的全部
                if (beforeHook({ target })) {
                    listener(payload);
                    // if (void 0 === this.beforeEachHook) {
                    //     listener(payload);
                    // } else {
                    //     // 全局钩子
                    //     this.beforeEachHook(payload, () => {
                    //         listener(payload);
                    //     });
                    // }
                }
            }
        }
    };

    /**
     * 事件拦截器
     * @param hook 钩子函数
     */
    // beforeEach2(hook: BeforeEachHook): void {
    //     this.beforeEachHook = hook;
    // };

    /**
     * 销毁实例
     */
    destroy() {
        this.listenersMap = {};
    };
};