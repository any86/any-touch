/**
 * 管理实例和元素的映射关系
 * 一个元素只能对应一个实例
 */
export default class <T extends { new(...arys: any): any }> {
    // 存储映射关系
    stock: { el: HTMLElement, instance: InstanceType<T> }[];
    ClassObject: T;

    constructor(ClassObject: T) {
        this.stock = [];
        this.ClassObject = ClassObject;
    };

    /**
    * 获取元素在stock中的索引
    * @param {Element} 元素 
    * @returns {Number} 元素索引 
    */
    getIndexByEl(el: HTMLElement): number {
        for (let i = 0, len = this.stock.length; i < len; i++) {
            if (el === this.stock[i].el) {
                return i;
            }
        }
        return -1;
    };

    /**
     * 获取实例
     * @param {Number} 索引
     * @return {InstanceType<T>} 实例 
     */
    getInstanceByIndex(index: number): InstanceType<T> {
        return this.stock[index]!.instance;
    };

    /**
     * 删除指定实例
     * @param {Number} 索引
     */
    removeInstanceByIndex(index: number): void {
        this.stock.splice(index, 1);
    };

    /**
     * 获取实例, 如果没有新建
     * @param {Element} 目标元素
     * @param {InstanceType<T>}  InstanceType<T>实例
     */
    getOrCreateInstanceByEl(el: HTMLElement): InstanceType<T> {
        const manageIndex = this.getIndexByEl(el);
        // 防止同一个元素上同一个指令实例化多个InstanceType<T>
        if (-1 === manageIndex) {
            // 新建实例
            const instance = new this.ClassObject(el);
            this.stock.push({el, instance});
            return instance;
        } else {
            return this.getInstanceByIndex(manageIndex);
        }
    };
};