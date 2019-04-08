import AnyTouch from 'any-touch';
interface Manage { el: HTMLElement, instance: AnyTouch };
/**
 * 管理实例和元素的映射关系
 */
export default class {
    manages: Manage[] = [];

    constructor() {
        this.manages = [];
    };

    /**
    * 获取元素在_manages中的索引
    * @param {Element} 元素 
    * @returns {Number} 元素索引
    */
    getManageIndex(el: HTMLElement): number {
        for (let i = 0, len = this.manages.length; i < len; i++) {
            if (el === this.manages[i].el) {
                return i;
            }
        }
        return -1;
    };

    /**
     * 存储实例
     * @param {AnyTouch} 实例
     * @return {Number} 添加后的索引 
     */
    addToManage(el: HTMLElement, instance: AnyTouch): number {
        return this.manages.push({ el, instance })
    };

    /**
     * 获取实例
     * @param {Number} 索引
     * @return {AnyTouch} 实例 
     */
    getInstanceByIndex(index: number): AnyTouch {
        return (this.manages[index] || {}).instance;
    };

    /**
     * 删除指定实例
     * @param {Number} 索引
     */
    removeInstanceByIndex(index: number):void{
        this.manages.splice(index, 1);
    };

    /**
     * 获取实例, 如果没有新建
     * @param {Element} 目标元素
     * @param {AnyTouch}  AnyTouch实例
     */
    getOrCreateInstanceByEl (el: HTMLElement):AnyTouch {
        const manageIndex = this.getManageIndex(el);
        // 防止同一个元素上同一个指令实例化多个AnyTouch
        if (-1 === manageIndex) {
            // 新建实例
            const instance = new AnyTouch(el);
            this.addToManage(el, instance);
            return instance;
        } else {
            return this.getInstanceByIndex(manageIndex);
        }
    };
};