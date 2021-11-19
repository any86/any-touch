// 事件名 : 事件对象
export interface TypeAndEventMap {
    // symbol暂时不加, 没法兼容低版本的ts
    // 可以用户手动加
    [type: string]: any;
}


// 事件回调
export interface AEventListener<Event> {
    (event: Event): void;
}


// 事件名 : 回调函数
type TypeAndEventListenerMap<EventMap = TypeAndEventMap> = Partial<{
    [Key in keyof EventMap]: AEventListener<EventMap[Key]>[];
}>

// type Covert2Array<T> = T extends unknown[] ? T : T[];

// 拦截器
export interface Interceptor {
    (context: any, next: () => void): void
}

// Payloads 后面会自动转成数组
export default class AnyEvent<EventMap extends TypeAndEventMap = TypeAndEventMap> {
    // 事件仓库
    private __map: TypeAndEventListenerMap<EventMap> = {};
    // 拦截器
    private __interceptor?: Interceptor;

    /**
     * 当前事件对象
     */
    event: unknown;

    /**
     * 注册拦截器
     * @param interceptor 拦截器
     */
    beforeEach(interceptor: Interceptor) {
        this.__interceptor = interceptor;
    }

    /**
     * 绑定事件
     * @param typeOrTypes 事件名
     * @param listener 回调函数
     */
    on<Key extends keyof EventMap>(typeOrTypes: Key | Key[], listener: AEventListener<EventMap[Key]>): this {
        const types = Array.isArray(typeOrTypes) ? typeOrTypes : [typeOrTypes];
        for (const type of types) {
            this.__map[type] = this.__map[type] || [];
            const listeners = this.__map[type];
            if (listeners) {
                listeners.push(listener);
            }
        }
        return this;
    }

    /**
     * 按照监听器注册的顺序，同步地调用每个注册到名为 eventName 的事件的监听器，并传入提供的参数。
     * @param type 事件名
     * @param payload 数据
     * @param done 运行成功执行
     */
    emit(type: string, payload?: unknown, done?: () => void) {
        if (void 0 !== this.__interceptor) {
            this.__interceptor(this, () => {
                emit<EventMap>(this.__map, type, payload);
                this.event = payload;
                done && done();
            });
        } else {
            emit<EventMap>(this.__map, type, payload);
            this.event = payload;
            done && done();
        }
    }

    /**
     * 解除绑定,
     * 如果不指定listener,
     * 那么解除所有eventName对应回调
     * @param type 事件名
     * @param listener 回调函数
     */
    off<Key extends keyof EventMap>(type: Key, listener?: AEventListener<EventMap[Key]>) {
        const listeners = this.__map[type];
        // 事件存在
        if (void 0 !== listeners) {
            // 清空事件名对应的所有回调
            if (void 0 === listener) {
                delete this.__map[type];
            }
            // 清空指定回调
            else {
                const index = listeners.findIndex(cb => cb === listener);
                listeners.splice(index, 1);
            }
        }
    }

    /**
     * 销毁实例
     */
    destroy() {
        this.__map = {};
    }
}

function emit<T extends TypeAndEventMap>(map: TypeAndEventListenerMap<T>, type: string, payload: any) {
    const listeners = map[type];
    if (listeners?.length) {
        for (const listener of listeners) {

            listener(payload);
        }
    }
}

// const e = new AnyEvent()
// e.beforeEach((type, next) => {
//     if ('c' == type) next();
// })
// e.on('a', console.log);
// e.on('b', console.log);
// e.on('c', console.log);

// setTimeout(() => {
//     e.emit('c', 3);
// }, 1000)

// e.emit('a', 1);
// e.emit('b', 2);

