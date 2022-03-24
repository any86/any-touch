import { App, DirectiveBinding, onUnmounted, createApp } from 'vue';
import type { AnyTouchEvent, Options } from 'any-touch';
import ATouch from 'any-touch';
const elAndAtMap = new WeakMap();
export default {
    install: (app: App, options: Options) => {
        app.directive('touch', {
            mounted(el, binding) {
                const at = new ATouch(el);
                elAndAtMap.set(el, at);
            },

            unmounted(el) {
                elAndAtMap.get(el).destroy();
            }
        })
    }
}