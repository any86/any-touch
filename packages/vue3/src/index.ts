import type { App, DirectiveBinding } from 'vue';
import type { Options, SupportElement } from 'any-touch';
import ATouch from 'any-touch';
const elAndAtMap = new WeakMap();
export default {
    install: (app: App) => {
        app.directive('touch', {
            mounted(el: SupportElement, { value }: DirectiveBinding<Options>) {
                elAndAtMap.set(el, new ATouch(el, value));
            },

            unmounted(el: SupportElement) {
                elAndAtMap.get(el).destroy();
            }
        })
    }
}