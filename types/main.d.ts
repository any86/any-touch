import { AnyTouch } from './AnyTouch';
export default class extends AnyTouch {
    static vTouch: {
        install(Vue: import("vue/types/vue").VueConstructor<import("vue/types/vue").Vue>): void;
    };
}
