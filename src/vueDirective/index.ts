// 注意: 由于vue指令没办法对指令进行优先级设置, 所以指令版本并不能实现AnyTouch所有的功能,
// 比如新建手势. 所以指令版只支持tap/doubletap/pan/swipe/rotate/pinch等默认手势
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

            // 匹配AnyTouch设置
            if ('config' === binding.arg) {
                instance.set(binding.value);
            }
            // 匹配手势, 无"-""
            else if (/^((?!-).)*$/.test(binding.arg)) {
                console.log(binding.modifiers);
                // 绑定事件
                instance.on(binding.arg, (ev: Computed) => {
                    if (!!binding.modifiers.preventDefault) {
                        if(binding.modifiers.prevent) {
                            ev.preventDefault();
                        }
                    }
                    // if (binding.modifiers.self && el !== e.target) return;
                    binding.value(ev);
                });
            }
            // 匹配手势设置
            else if (/\-config$/.test(binding.arg)) {
                const gestureName = binding.arg.replace('-config', '');
                instance.get(gestureName).set(binding.value)
            }
            // 匹配requireFailure
            else if (/\-require-failure/.test(binding.arg)) {
                const gestureNames = binding.arg.split('-require-failure-');
                instance.get(gestureNames[0]).requireFailure(gestureNames[1]);
            }
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
