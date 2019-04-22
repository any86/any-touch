// 注意: 由于vue指令没办法对指令进行优先级设置, 所以指令版本并不能实现AnyTouch所有的功能,
// 比如新建手势. 所以指令版只支持tap/doubletap/pan/swipe/rotate/pinch等默认手势
import { Computed } from '../interface';
import { VueConstructor } from 'vue/types/vue';
import InstanceManage from './InstanceManage';
import { AnyTouch } from '../AnyTouch';

// 管理实例和元素的映射关系
const iManage = new InstanceManage(AnyTouch);
// 导出指令
const plugin = {
    install(Vue: VueConstructor) {
        const _bindEvent = (el: HTMLElement, binding: any) => {
            let instance = iManage.getOrCreateInstanceByEl(el);
            // 导入AnyTouch实例
            if (undefined !== binding.value) {
                binding.value(instance);
            }
        };

        /**
         * 解除绑定事件
         * @param {Element} 关联元素 
         */
        const _unbindEvent = (el: HTMLElement) => {
            const index = iManage.getIndexByEl(el);
            // 防止一个元素上的多个手势指令会重复触发删除
            if (-1 !== index && undefined !== iManage.getInstanceByIndex(index)) {
                iManage.getInstanceByIndex(index).destroy();
                iManage.removeInstanceByIndex(index);
            }
        };

        Vue.directive('touch', {
            inserted(el, binding) {
                _bindEvent(el, binding);
            },

            update(el, binding) {
                _bindEvent(el, binding);
            },

            unbind(el) {
                _unbindEvent(el);
            }
        });
    }
};

// if('test' !== process.env.NODE_ENV){
    
// }
// 自动加载插件
// if (typeof <any>window !== 'undefined' && (<any>window).Vue) {
//     (<any>window).Vue.use(plugin);
// };

export default plugin;
