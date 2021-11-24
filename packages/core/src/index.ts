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
    Computed,
    AnyTouchEvent,
    NativeEvent,
    InputCreatorFunctionMap,
    InputCreatorFunction,
    ComputeFunction,
    ComputeFunctionCreator,
    PluginContext,
    Plugin,
    PluginOptions,
} from '@any-touch/shared';

import { TOUCH_START, TOUCH_MOVE, TOUCH_END, TOUCH_CANCEL, MOUSE_DOWN, MOUSE_MOVE, MOUSE_UP } from '@any-touch/shared';

import { mouse, touch } from './createInput';
import dispatchDomEvent from './dispatchDomEvent';
import canPreventDefault from './canPreventDefault';
import bindElement from './bindElement';
// type TouchAction = 'auto' | 'none' | 'pan-x' | 'pan-left' | 'pan-right' | 'pan-y' | 'pan-up' | 'pan-down' | 'pinch-zoom' | 'manipulation';

/**
 * 默认设置
 */
export interface Options {
    // 是否触发DOM事件
    domEvents?: false | EventInit;
    preventDefault?: boolean | ((e: NativeEvent) => boolean);
}

/**
 * 默认设置
 */
const DEFAULT_OPTIONS: Options = {
    domEvents: { bubbles: true, cancelable: true },
    preventDefault: (event) => {
        if (event.target && 'tagName' in event.target) {
            const { tagName } = event.target;
            return !/^(?:INPUT|TEXTAREA|BUTTON|SELECT)$/.test(tagName);
        }
        return false;
    },
};
const TYPE_UNBIND = 'u';

type DefaultTypeNames =
    | 'tap'
    | 'press'
    | 'pressup'
    | 'pan'
    | 'panstart'
    | 'panmove'
    | 'panend'
    | 'pancancel'
    | 'swipe'
    | 'pinch'
    | 'pinchstart'
    | 'pinchmove'
    | 'pinchend'
    | 'pinchcancel'
    | 'rotate'
    | 'rotatestart'
    | 'rotatemove'
    | 'rotateend'
    | 'rotatecancel'
    | 'computed'
    | 'at:start'
    | 'at:move'
    | 'at:end'
    | 'at:cancel'
    | 'input'
    | typeof TYPE_UNBIND;

/**
 * 默认的事件名和事件对象映射
 */
type EventNameMap<K extends string> = { [k in K]: AnyTouchEvent };

/**
 * 手势库的核心,
 * 本身不具备手势识别,
 * 需要加载识别器插件.
 * @example
 * import Core from '@any-touch/core';
 * import pan from '@any-touch/pan';
 * const at = new Core();
 * at.use(pan);
 */
export default class<K extends string = DefaultTypeNames> extends AnyEvent<EventNameMap<DefaultTypeNames | K>> {
    /**
     * 当前绑定元素
     */
    el?: HTMLElement;
    /**
     * 当前插件(仅供插件开发者使用)
     */
    c?: PluginContext;
    // 选项
    private __options: Options;
    // 事件类型和输入函数的映射
    private __inputCreatorMap: InputCreatorFunctionMap;
    // 计算函数队列
    private __computeFunctionList: ComputeFunction[] = [];
    // 计算函数生成器仓库
    private __computeFunctionCreatorList: ComputeFunctionCreator[] = [];
    // 插件
    private __plugins: PluginContext[] = [];

    /**
     * @param el 目标元素, 微信下没有el
     * @param options 选项
     */
    constructor(el?: HTMLElement, options?: Options) {
        super();
        this.el = el;
        this.__options = { ...DEFAULT_OPTIONS, ...options };

        // 之所以强制是InputCreatorFunction<SupportEvent>,
        // 是因为调用this.__inputCreatorMap[event.type]的时候还要判断类型,
        // 因为都是固定(touch&mouse)事件绑定好的, 没必要判断
        const createInputFromTouch = touch(this.el) as InputCreatorFunction<NativeEvent>;
        const createInputFromMouse = mouse() as InputCreatorFunction<NativeEvent>;
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
            } catch {}
            // 绑定元素
            this.on(
                TYPE_UNBIND,
                bindElement(
                    el,
                    this.catchEvent.bind(this),
                    !this.__options.preventDefault && supportsPassive ? { passive: true } : false
                )
            );
        }
    }

    /**
     * 加载并初始化插件
     * @param plugin 插件
     * @param pluginOptions 插件选项
     */
    use<P extends Plugin = Plugin>(plugin: P, pluginOptions?: Parameters<P>[1]) {
        this.__plugins.push(plugin(this, pluginOptions));
    }
    /**
     * 拦截器
     * 可以控制事件的触发
     * @param interceptor 拦截函数
     */
    beforeEach(
        interceptor: (currentPluginContext: PluginContext & { event: AnyTouchEvent }, next: () => void) => void
    ) {
        super.beforeEach.call(this, (context, next) => {
            // 跳过computed事件,
            // 只保留识别器通过emit2触发的事件
            if (void 0 === context.c?.name) {
                next();
            } else {
                interceptor({ ...context.c, event: this.event }, next);
            }
        });
    }

    /**
     * 获取识别器通过名字
     * @param name 识别器的名字
     * @return 返回识别器
     */
    get(name: string) {
        for (const plugin of this.__plugins) {
            if (name === plugin.name) {
                return plugin;
            }
        }
    }

    /**
     * 带DOM事件的emit(仅供插件开发者使用)
     * @param type 事件类型
     * @param payload 数据
     * @param pluginContext 插件实例
     */
    set(newOptions: Partial<Options>) {
        this.__options = { ...this.__options, ...newOptions };
    }

    /**
     * 带DOM事件的emit(仅供插件开发者使用)
     * @param type 事件类型
     * @param payload 数据
     * @param pluginContext 插件实例
     */
    emit2(type: string, payload: AnyTouchEvent, pluginContext: PluginContext) {
        this.c = pluginContext;
        this.emit(type, {...payload,type}, () => {
            // this.emit('at:after',{...payload,name:type})
            const { target } = payload;
            const { domEvents } = this.__options;
            // 触发DOM事件
            if (!!domEvents && void 0 !== this.el && null !== target) {
                // 所以此处的target会自动冒泡到目标元素
                dispatchDomEvent(target, { ...payload, type }, domEvents);
                // dispatchDomEvent(target, { ...payload, type:'at:after',name:type }, domEvents);
            }
        });
    }

    /**
     * 监听input变化
     * @param event Touch / Mouse事件对象
     */
    catchEvent(event: NativeEvent) {
        // if (!event.cancelable) {
        //     this.emit('error', { code: 0, message: '页面滚动的时候, 请暂时不要操作元素!' });
        // }
        const input = this.__inputCreatorMap[event.type](event);
        // 跳过无效输入
        // 比如没有按住鼠标左键的移动会返回undefined
        if (void 0 !== input) {
            const stopPropagation = () => event.stopPropagation();
            const preventDefault = () => event.preventDefault();
            const stopImmediatePropagation = () => event.stopImmediatePropagation();
            if (canPreventDefault(event, this.__options)) {
                preventDefault();
            }
            this.emit('input', input);
            this.emit2(`at:${input.phase}`, input as AnyTouchEvent, {} as PluginContext);

            // ====== 计算结果 ======
            const computed: Computed = {};
            this.__computeFunctionList.forEach((compute) => {
                // disabled
                const result = compute(input, computed);
                if (void 0 !== result) {
                    for (const key in result) {
                        computed[key] = result[key];
                    }
                }
            });

            this.emit('computed', { ...input, ...computed, stopPropagation, preventDefault, stopImmediatePropagation });
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
     * 销毁
     */
    destroy() {
        // 解绑事件
        this.emit(TYPE_UNBIND);
        super.destroy();
    }
}
