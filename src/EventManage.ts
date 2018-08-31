
export default class {
    stack: Function[];

    constructor() {
        this.stack = [];
    };

    /**
     * 触发回调
     * @param {String} 事件名
     * @param {Object} 参数
     */
    emit(eventName: string, payload: object): void {
        this.stack[eventName].forEach(callback => {
            callback(payload);
        });
    };

    /**
     * 注册事件
     * @param {String} 事件名
     * @param {Function} 回调函数
     */
    on(eventName: string, callback: () => {}) {
        this.stack[eventName] = this.stack[eventName] || [];
        this.stack[eventName].push(callback);
    }
};