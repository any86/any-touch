/**
 * 主程序, 不包含手势,
 * 主要用来适配Mouse/Touch事件
 * ==================== 参考 ====================
 * https://segmentfault.com/a/1190000010511484#articleHeader0
 * https://segmentfault.com/a/1190000007448808#articleHeader1
 * hammer.js http://hammerjs.github.io/
 * ==================== 流程 ====================
 * Event(Mouse|Touch) => BaseInput => Input => Computed => AnyTouchEvent
 */
import AnyEvent from 'any-event';
import type {
    RecognizerConstruct,
    AnyTouchEvent,
    SupportEvent,
    ComputeWrapFunction,
    InputCreatorFunctionMap,
    InputCreatorFunction,
    ComputeFunction,
    ComputeFunctionCreator,
    KV,
} from '@any-touch/shared';

import {
    Recognizer,
    TOUCH_START,
    TOUCH_MOVE,
    TOUCH_END,
    TOUCH_CANCEL,
    MOUSE_DOWN,
    MOUSE_MOVE,
    MOUSE_UP,
    STATUS_POSSIBLE,
    STATUS_START,
    STATUS_MOVE,
    STATUS_END,
    STATUS_CANCELLED,
    STATUS_FAILED,
    STATUS_RECOGNIZED,
} from '@any-touch/shared';

import { mouse, touch } from './createInput';
import dispatchDomEvent from './dispatchDomEvent';
import canPreventDefault from './canPreventDefault';
import bindElement from './bindElement';
// type TouchAction = 'auto' | 'none' | 'pan-x' | 'pan-left' | 'pan-right' | 'pan-y' | 'pan-up' | 'pan-down' | 'pinch-zoom' | 'manipulation';

type BeforeEachHook = (recognizer: Recognizer, map: Record<string, Recognizer>, next: () => void) => void;
/**
 * 默认设置
 */
export interface Options {
    // 是否触发DOM事件
    domEvents?: false | EventInit;
    preventDefault?: boolean;
    // 不阻止默认行为的白名单
    preventDefaultExclude?: RegExp | ((ev: SupportEvent) => boolean);
}

/**
 * 默认设置
 */
const DEFAULT_OPTIONS: Options = {
    domEvents: { bubbles: true, cancelable: true },
    preventDefault: true,
    preventDefaultExclude: /^(?:INPUT|TEXTAREA|BUTTON|SELECT)$/,
};

export default class AnyTouch extends AnyEvent {
    // 识别器集合(未实例化)
    static __Recognizers: [new (...args: any) => Recognizer, Record<string, any> | undefined][] = [];
    // 计算函数外壳函数集合
    static __computeFunctionMap: Record<string, ComputeWrapFunction> = {};
    /**
     * 安装插件
     * @param {AnyTouchPlugin} 插件
     * @param {any[]} 插件参数
     */
    static use = (Recognizer: new (...args: any) => Recognizer, recognizerOptions?: Record<string, any>): void => {
        AnyTouch.__Recognizers.push([Recognizer, recognizerOptions]);
    };

    // 目标元素
    el?: HTMLElement;
    beforeEachHook?: BeforeEachHook;

    // 选项
    private __options: Options;
    private __inputCreatorMap: InputCreatorFunctionMap;
    private __recognizerMap: Record<string, Recognizer> = {};
    private __recognizers: Recognizer[] = [];

    // 计算函数队列
    private __computeFunctionList: ComputeFunction[] = [];
    // 计算函数生成器仓库
    private __computeFunctionCreatorList: ComputeFunctionCreator[] = [];
    // 计算结果
    private __computed: KV = {};

    /**
     * @param el 目标元素, 微信下没有el
     * @param options 选项
     */
    constructor(el?: HTMLElement, options?: Options) {
        super();

        this.el = el;
        this.__options = { ...DEFAULT_OPTIONS, ...options };

        // 同步插件到实例
        // for (const [Recognizer, options] of AnyTouch.__Recognizers) {
        //     this.use(Recognizer, options);
        // }

        // 之所以强制是InputCreatorFunction<SupportEvent>,
        // 是因为调用this.__inputCreatorMap[event.type]的时候还要判断类型,
        // 因为都是固定(touch&mouse)事件绑定好的, 没必要判断
        const createInputFromTouch = touch(this.el) as InputCreatorFunction<SupportEvent>;
        const createInputFromMouse = mouse() as InputCreatorFunction<SupportEvent>;
        this.__inputCreatorMap = {
            [TOUCH_START]: createInputFromTouch,
            [TOUCH_MOVE]: createInputFromTouch,
            [TOUCH_END]: createInputFromTouch,
            [TOUCH_CANCEL]: createInputFromTouch,
            [MOUSE_DOWN]: createInputFromMouse,
            [MOUSE_MOVE]: createInputFromMouse,
            [MOUSE_UP]: createInputFromMouse,
        };

        // 绑定事件
        if (void 0 !== el) {
            // 观察了几个移动端组件, 作者都会加webkitTapHighlightColor
            // 比如vant ui
            // 所以在此作为默认值
            // 使用者也可通过at.el改回去
            el.style.webkitTapHighlightColor = 'rgba(0,0,0,0)';
            // 校验是否支持passive
            let supportsPassive = false;
            try {
                const opts = {};
                Object.defineProperty(opts, 'passive', {
                    get() {
                        // 不想为测试暴露, 会增加体积, 暂时忽略
                        /* istanbul ignore next */
                        supportsPassive = true;
                    },
                });
                window.addEventListener('_', () => void 0, opts);
            } catch { }

            // 绑定元素
            this.on(
                'unbind',
                bindElement(
                    el,
                    this.catchEvent.bind(this),
                    !this.__options.preventDefault && supportsPassive ? { passive: true } : false
                )
            );
        }
    }

    target(el: HTMLElement) {
        // return {
        //     on: (eventName: string, listener: Listener<AnyTouchEvent>): void => {
        //         this.on(eventName, listener, (event) => {
        //             const { targets } = event;
        //             // 检查当前触发事件的元素是否是其子元素
        //             return targets.every((target) => el.contains(target as HTMLElement));
        //         });
        //     },
        // };
    }

    /**
     * 带DOM事件的emit
     */
    emit2(type: string, payload: AnyTouchEvent) {
        this.emit(type, payload);
        const { target } = payload;
        const { domEvents } = this.__options;
        // 触发DOM事件
        if (!!domEvents && void 0 !== this.el && null !== target) {
            // 所以此处的target会自动冒泡到目标元素
            dispatchDomEvent(target, { ...payload, type }, domEvents);
        }
    }

    /**
     * 监听input变化
     * @param event Touch / Mouse事件对象
     */
    catchEvent(event: SupportEvent): void {
        const stopPropagation = () => event.stopPropagation();
        const preventDefault = () => event.preventDefault();
        const stopImmediatePropagation = () => event.stopImmediatePropagation();
        if (canPreventDefault(event, this.__options)) {
            preventDefault();
        }
        // if (!event.cancelable) {
        //     this.emit('error', { code: 0, message: '页面滚动的时候, 请暂时不要操作元素!' });
        // }
        const input = this.__inputCreatorMap[event.type](event);

        // 跳过无效输入
        // 比如没有按住鼠标左键的移动会返回undefined
        if (void 0 !== input) {
            this.emit('input', input);
            this.emit(`touch:${input.phase}`, input);

            // ====== 计算结果 ======
            const computed: KV = {};
            this.__computeFunctionList.forEach((computeFunction) => {
                const result = computeFunction(input);
                for (const key in result) {
                    computed[key] = result[key];
                }
            });
            this.emit('computed', { ...input, ...computed, stopPropagation, preventDefault, stopImmediatePropagation });

            // 缓存结果
            this.__computed = computed;

            // const { domEvents } = this.__options;
            // // 不触发DOM事件
            // if (false !== domEvents) {
            //     const { target } = computed;
            //     if (null !== target) {
            //         dispatchDomEvent(target, { ...input, type: AT }, domEvents);
            //         dispatchDomEvent(target, { ...input, type: AT_WITH_STATUS }, domEvents);
            //     }
            // }

            // // input -> computed
            // const computed = input as Computed;
            // for (const k in this.__computeFunctionMap) {
            //     Object.assign(computed, this.__computeFunctionMap[k](computed));
            // }

            // // 缓存每次计算的结果
            // // 以函数名为键值
            // for (const recognizer of this.__recognizers) {
            //     if (recognizer.disabled) continue;
            //     // 恢复上次的缓存
            //     recognizer.recognize(computed, (type) => {
            //         // 此时的e就是this.computed
            //         const payload = {
            //             ...computed,
            //             type,
            //             name: recognizer.name,
            //             stopPropagation,
            //             preventDefault,
            //             stopImmediatePropagation,
            //         };

            //         // 防止数据被vue类框架拦截
            //         Object?.freeze(payload);

            //         if (void 0 === this.beforeEachHook) {
            //             emit2(this, payload, this.__options);
            //         } else {
            //             this.beforeEachHook(recognizer, this.__recognizerMap, () => {
            //                 emit2(this, payload, this.__options);
            //             });
            //         }
            //     });
            // }
        }
    }

    /**
     * 缓存计算函数生成器到队列
     * @param computeFunctionCreatorList 一组计算函数生成器
     */
    compute(computeFunctionCreatorList: ComputeFunctionCreator[]) {
        for (const computeFunctionCreator of computeFunctionCreatorList) {
            if (!this.__computeFunctionCreatorList.includes(computeFunctionCreator)) {
                // 计算函数生成器队列
                this.__computeFunctionCreatorList.push(computeFunctionCreator);
                // 计算函数队列
                this.__computeFunctionList.push(computeFunctionCreator());
            }
        }
    }

    /**
     * 加载并初始化插件
     * @param plugin 插件
     * @param pluginOptions 插件选项
     */
    use(plugin: (context: this, pluginOptions: unknown) => unknown, pluginOptions?: unknown) {
        plugin(this, pluginOptions);

        // const name = pluginOptions?.name;
        // // 保证同一个事件只对应一个识别器
        // if (void 0 !== name && void 0 !== this.__recognizerMap[name]) return;

        // // 实例化
        // const recognizer = new Plugin(pluginOptions);

        // // 初始化计算函数
        // for (const createComputeFunction of recognizer.computeFunctions) {
        //     const { _id } = createComputeFunction;
        //     if (void 0 === this.__computeFunctionMap[_id]) {
        //         // 创建计算函数
        //         this.__computeFunctionMap[_id] = createComputeFunction();
        //     }
        // }

        // // 识别器管理
        // // recognizer.name是默认值或者options给定
        // this.__recognizerMap[recognizer.name] = recognizer;
        // this.__recognizers.push(this.__recognizerMap[recognizer.name]);
    }

    /**
     * 移除插件
     * @param {String} 识别器name
     */
    removeUse(recognizerName?: string): void {
        if (void 0 === recognizerName) {
            this.__recognizers = [];
            this.__recognizerMap = {};
        } else {
            for (const [index, recognizer] of this.__recognizers.entries()) {
                if (recognizerName === recognizer.options.name) {
                    this.__recognizers.splice(index, 1);
                    delete this.__recognizerMap[recognizerName];
                    break;
                }
            }
        }
    }

    // /**
    //  * 事件拦截器
    //  * @param hook 钩子函数
    //  */
    // beforeEach(hook: (recognizer: Recognizer, map: Record<string, Recognizer>, next: () => void) => void): void {
    //     this.beforeEachHook = hook;
    // }

    /**
     * 获取识别器通过名字
     * @param name 识别器的名字
     * @return 返回识别器
     */
    get(name: string): Recognizer | void {
        return this.__recognizerMap[name];
    }

    /**
     * 设置
     * @param options 选项
     */
    set(options: Options): void {
        this.__options = { ...this.__options, ...options };
    }

    /**
     * 销毁
     */
    destroy() {
        // 解绑事件
        this.emit('unbind');
        super.destroy();
    }
}
