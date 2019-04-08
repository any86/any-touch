import AnyTouch from 'any-touch';
import { Computed } from '../interface';
import { VueConstructor } from 'Vue/types/vue';
import InstanceManage from './InstanceManage';
// 管理实例和元素的映射关系
const iManage = new InstanceManage();
// 导出指令
const plugin = {
    install(Vue: VueConstructor) {
        const _bindEvent = (el: HTMLElement, binding: any) => {
            let instance = iManage.getOrCreateInstanceByEl(el);

            // 绑定事件
            instance.on(binding.arg, (ev: Computed) => {
                if (!!binding.modifiers.preventDefault) {
                    ev.preventDefault();
                }
                // if (binding.modifiers.self && el !== e.target) return;
                binding.value(ev);
            });
            console.log(iManage.manages);
        };

        /**
         * 解除绑定事件
         * @param {Element} 关联元素 
         */
        const _unbindEvent = (el: HTMLElement) => {
            const manageIndex = iManage.getManageIndex(el);
            // 防止一个元素上的多个手势指令会重复触发删除
            if (-1 !== manageIndex && undefined !== iManage.manages[manageIndex]) {
                iManage.getInstanceByIndex(manageIndex).destroy();
                iManage.removeInstanceByIndex(manageIndex);
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

// 自动加载插件
if (typeof <any>window !== 'undefined' && (<any>window).Vue) {
    (<any>window).Vue.use(plugin);
};

export default plugin;
