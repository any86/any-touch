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
import type { SupportElement } from 'any-touch';

import type {
    UnionToIntersection,
    Computed,
    AnyTouchEvent,
    NativeEvent,
    InputCreatorFunctionMap,
    InputCreatorFunction,
    ComputeFunction,
    ComputeFunctionCreator,
    PluginContext,
    Plugin,
    Input,
} from '@any-touch/shared';

import {
    TOUCH_START,
    TOUCH_MOVE,
    TOUCH_END,
    TOUCH_CANCEL,
    MOUSE_DOWN,
    MOUSE_MOVE,
    MOUSE_UP,
} from './const';

import { mouse, touch } from './createInput';
import dispatchDomEvent from './dispatchDomEvent';
import canPreventDefault from './canPreventDefault';
import bindElement from './bindElement';
// type TouchAction = 'auto' | 'none' | 'pan-x' | 'pan-left' | 'pan-right' | 'pan-y' | 'pan-up' | 'pan-down' | 'pinch-zoom' | 'manipulation';
export { AnyTouchEvent } from '@any-touch/shared';
export interface Options {
    // 是否触发DOM事件
    domEvents?: false | EventInit;
    preventDefault?: boolean | ((e: NativeEvent) => boolean);
}

const TYPE_COMPUTED = 'computed';

/**
 * 默认设置
 */
const DEFAULT_OPTIONS: Options = {
    domEvents: { bubbles: true, cancelable: true },
    preventDefault: (event) => {
        // console.log((event.target as any).tagName);
        if (event.target && 'tagName' in event.target) {
            const { tagName } = event.target;
            return !/^(?:INPUT|TEXTAREA|BUTTON|SELECT)$/.test(tagName as string);
        }
        /* istanbul ignore next */
        return false;
    },
};
const TYPE_UNBIND = 'u';
const TYPE_INPUT = 'input';
const TYPE_AT_AFTER = 'at:after';
type GetPluginContext<N> = N extends keyof PluginContextMap ? PluginContextMap[N] : (PluginContext | undefined);

/**
 * 默认的事件名和事件对象映射
 */
export interface EventMap {
    input: Input;
    computed: Record<string, any>;
    u: undefined;
    'at:after': Computed;
    'at:start': Input;
    'at:move': Input;
    'at:cancel': Input;
    'at:end': Input;
}
/**
 * 插件映射
 * {名称: 插件实例}
 * @example
 * {tap:TapContext}
 */
export interface PluginContextMap {

}

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
export default class extends AnyEvent<EventMap> {
    /**
     * 版本
     */
    v = '__VERSION__';
    /**
     * 当前绑定元素
     */
    el?: SupportElement;
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
    private __pluginContexts: PluginContext[] = [];
    // 是否忽略mouse事件
    private __isIgnoreMouse: boolean = false;

    /**
     * @param el 目标元素, 微信下没有el
     * @param options 选项
     */
    constructor(el?: SupportElement, options?: Options) {
        super();
        this.el = el;
        this.c = {} as PluginContext;
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

        // 触发DOM事件
        this.on(TYPE_AT_AFTER, payload => {
            const { target, __type } = payload;
            const { domEvents } = this.__options;
            if (!!domEvents && void 0 !== this.el && !!target) {
                // 所以此处的target会自动冒泡到目标元素
                dispatchDomEvent(__type, target, payload, domEvents);
                dispatchDomEvent(TYPE_AT_AFTER, target, payload, domEvents);
            }
        });

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
            // 只有在preventDefault中显式的指明false才能使用{ passive: true }
            // fix: document和body上绑定事件的时候, 默认passive=true
            // https://github.com/any86/Notes/issues/82
            this.on(
                TYPE_UNBIND,
                bindElement(
                    el,
                    this.catchEvent.bind(this),
                    false === this.__options.preventDefault && supportsPassive ? { passive: true } : { passive: false }
                )
            );
        }
    }

    /**
     * 加载并初始化插件
     * @param plugin 插件
     * @param pluginOptions 插件选项
     */
    use<P extends Plugin>(plugin: P, pluginOptions?: Parameters<P>[1]): void {
        this.__pluginContexts.push(plugin(this, pluginOptions));
    }

    /**
     * 监听input变化
     * @param event Touch / Mouse事件对象
     */
    catchEvent(event: NativeEvent): void {
        // if (!event.cancelable) {
        //     this.emit('error', { code: 0, message: '页面滚动的时候, 请暂时不要操作元素!' });
        // }
        const input = this.__inputCreatorMap[event.type](event);
        // 跳过无效输入
        // 比如没有按住鼠标左键的移动会返回undefined
        if (void 0 !== input) {
            const stopPropagation = () => event.stopPropagation();
            const stopImmediatePropagation = () => event.stopImmediatePropagation();
            const preventDefault = () => event.preventDefault();
            if (canPreventDefault(event, this.__options)) {
                preventDefault();
            } else {
                if ('touchstart' === event.type) {
                    this.__isIgnoreMouse = true;
                } else if ('touchmove' === event.type) {
                    // 这时候肯定不会再触发mouse了
                    // 所以重置开关
                    this.__isIgnoreMouse = false;
                }

                if (this.__isIgnoreMouse && event.type.startsWith('mouse')) {
                    if ('mouseup' === event.type) {
                        this.__isIgnoreMouse = false;
                    }
                    return;
                }
            }
            this.emit(TYPE_INPUT, input);
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
            // computed
            this.emit(TYPE_COMPUTED, { ...input, ...computed, stopPropagation, stopImmediatePropagation, preventDefault });
        }
    }

    /**
     * 缓存计算函数生成器到队列
     * @param computeFunctionCreatorList 一组计算函数生成器
     */
    compute<CList extends ComputeFunctionCreator[] = ComputeFunctionCreator[]>(
        computeFunctionCreatorList: CList,
        // CList[0]的0是几都没关系, 
        // 因为不是元祖,
        // 所以结果都会是ReturnType<ReturnType<CList[0]>|ReturnType<ReturnType<CList[n]>
        callback: (computed: UnionToIntersection<ReturnType<ReturnType<CList[0]>>> & Input) => void,
    ) {
        // 注册到队列
        for (const computeFunctionCreator of computeFunctionCreatorList) {
            if (!this.__computeFunctionCreatorList.includes(computeFunctionCreator)) {
                // 计算函数生成器队列
                this.__computeFunctionCreatorList.push(computeFunctionCreator);
                // 计算函数队列
                this.__computeFunctionList.push(computeFunctionCreator());
            }
        }
        // 🍩computed
        this.on(TYPE_COMPUTED, callback as ((computed: Computed) => void));
    }

    /**
     * 拦截器
     * 可以控制事件的触发
     * @param interceptor 拦截函数
     */
    beforeEach(
        interceptor: (type: string, next: () => void) => void
    ) {
        super.beforeEach((type, next) => {
            // 跳过computed事件,
            // 只保留识别器通过emit2触发的事件
            if (this.c?.name) {
                // console.log(this.c?.name);
                interceptor(type as string, next);
            } else {
                next();
            }
        });
    }

    /**
     * 获取识别器通过名字
     * @param name 识别器的名字
     * @return 返回识别器
     */
    get<N extends keyof PluginContextMap>(name: N): GetPluginContext<N> {
        return this.__pluginContexts.find(pluginContext => name === pluginContext.name) as GetPluginContext<N>;
    }

    /**
     * 设置选项
     * @param newOptions 选项
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
    emit2(type: string, payload: Computed, pluginContext: PluginContext) {
        this.c = pluginContext;
        this.emit(type as keyof EventMap, { ...payload, type }, () => {
            this.emit(TYPE_AT_AFTER, { ...payload, name: type, __type: type })
        });
        // this.c = {} as PluginContext;
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