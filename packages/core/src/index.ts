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
import type { Listener } from 'any-event';

import type {
    RecognizerReturn,
    RecognizerFunction,
    RecognizerOptions,
    AnyTouchEvent, SupportEvent, ComputeFunction, ComputeWrapFunction, InputCreatorFunctionMap, InputCreatorFunction, Computed, RecognizerContext
} from '@any-touch/shared';
import {
    TOUCH_START, TOUCH_MOVE, TOUCH_END, TOUCH_CANCEL, MOUSE_DOWN, MOUSE_MOVE, MOUSE_UP,
    STATUS_POSSIBLE, STATUS_START, STATUS_MOVE, STATUS_END, STATUS_CANCELLED, STATUS_FAILED, STATUS_RECOGNIZED
} from '@any-touch/shared';

import { mouse, touch } from './createInput';
import dispatchDomEvent from './dispatchDomEvent';
import canPreventDefault from './canPreventDefault';
import bindElement from './bindElement';
import { use, removeUse } from './use';
import emit2 from './emit2';
// type TouchAction = 'auto' | 'none' | 'pan-x' | 'pan-left' | 'pan-right' | 'pan-y' | 'pan-up' | 'pan-down' | 'pinch-zoom' | 'manipulation';


type BeforeEachHook = (recognizerContext: RecognizerContext, next: () => void) => void;
/**
 * 默认设置
 */
export interface Options {
    domEvents?: false | EventInit;
    isPreventDefault?: boolean;
    // 不阻止默认行为的白名单
    preventDefaultExclude?: RegExp | ((ev: SupportEvent) => boolean);
}

/**
 * 默认设置
 */
const DEFAULT_OPTIONS: Options = {
    domEvents: { bubbles: true, cancelable: true },
    isPreventDefault: true,
    preventDefaultExclude: /^(?:INPUT|TEXTAREA|BUTTON|SELECT)$/
};
export default class AnyTouch extends AnyEvent<AnyTouchEvent> {
    static Tap: RecognizerFunction;
    static Pan: RecognizerFunction;
    static Swipe: RecognizerFunction;
    static Press: RecognizerFunction;
    static Pinch: RecognizerFunction;
    static Rotate: RecognizerFunction;
    static STATUS_POSSIBLE: typeof STATUS_POSSIBLE;
    static STATUS_START: typeof STATUS_START;
    static STATUS_MOVE: typeof STATUS_MOVE;
    static STATUS_END: typeof STATUS_END;
    static STATUS_CANCELLED: typeof STATUS_CANCELLED;
    static STATUS_FAILED: typeof STATUS_FAILED;
    static STATUS_RECOGNIZED: typeof STATUS_RECOGNIZED;

    static version = '__VERSION__';
    // 识别器集合
    static recognizers: RecognizerReturn[] = [];
    static recognizerMap: Record<string, RecognizerReturn> = {};
    // 计算函数外壳函数集合
    static computeFunctionMap: Record<string, ComputeWrapFunction> = {};
    /**
     * 安装插件
     * @param {AnyTouchPlugin} 插件
     * @param {any[]} 插件参数
     */
    static use = (Recognizer: RecognizerFunction, options?: RecognizerOptions): void => {
        use(AnyTouch, Recognizer, options);
    };
    /**
     * 卸载插件[不建议]
     */
    static removeUse = (recognizerName?: string): void => {
        removeUse(AnyTouch, recognizerName);
    };
    computeFunctionMap: Record<string, ComputeFunction> = {};
    // 目标元素
    el?: HTMLElement;
    // 选项
    options: Options;
    inputCreatorMap: InputCreatorFunctionMap;
    recognizerMap: Record<string, RecognizerReturn> = {};
    recognizers: RecognizerReturn[] = [];
    beforeEachHook?: BeforeEachHook;
    cacheComputedFunctionGroup = Object.create(null);
    /**
     * @param el 目标元素
     * @param options 选项
     */
    constructor(el?: HTMLElement, options?: Options) {
        super();
        this.el = el;
        this.options = { ...DEFAULT_OPTIONS, ...options };

        // 同步通过静态方法use引入的手势附带的"计算函数"
        for (const k in AnyTouch.computeFunctionMap) {
            this.computeFunctionMap[k] = AnyTouch.computeFunctionMap[k]();
        }

        // 同步插件到实例
        this.recognizerMap = AnyTouch.recognizerMap;
        this.recognizers = AnyTouch.recognizers;

        // 之所以强制是InputCreatorFunction<SupportEvent>,
        // 是因为调用this.inputCreatorMap[event.type]的时候还要判断类型,
        // 因为都是固定(touch&mouse)事件绑定好的, 没必要判断
        const createInputFromTouch = touch(this.el) as InputCreatorFunction<SupportEvent>;
        const createInputFromMouse = mouse() as InputCreatorFunction<SupportEvent>;
        this.inputCreatorMap = {
            [TOUCH_START]: createInputFromTouch,
            [TOUCH_MOVE]: createInputFromTouch,
            [TOUCH_END]: createInputFromTouch,
            [TOUCH_CANCEL]: createInputFromTouch,
            [MOUSE_DOWN]: createInputFromMouse,
            [MOUSE_MOVE]: createInputFromMouse,
            [MOUSE_UP]: createInputFromMouse
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
                Object.defineProperty(opts, 'passive', ({
                    get() {
                        // 不想为测试暴露, 会增加体积, 暂时忽略
                        /* istanbul ignore next */
                        supportsPassive = true;
                    }
                }));
                window.addEventListener('_', () => void 0, opts);
            } catch { }

            // 绑定元素
            this.on(
                'unbind',
                bindElement(
                    el,
                    this.catchEvent.bind(this),
                    !this.options.isPreventDefault && supportsPassive ? { passive: true } : false
                )
            );
        }
    }

    target(el: HTMLElement) {
        return {
            on: (eventName: string, listener: Listener<AnyTouchEvent>): void => {
                this.on(eventName, listener, event => {
                    const { targets } = event;
                    // 检查当前触发事件的元素是否是其子元素
                    return event.target === el &&
                        targets.every((target) => el.contains(target as HTMLElement))
                });
            }
        };
    };


    /**
     * 监听input变化s
     * @param event Touch / Mouse事件对象
     */
    catchEvent(event: SupportEvent): void {
        if (canPreventDefault(event, this.options)) {
            event.preventDefault();
        }
        // if (!event.cancelable) {
        //     this.eventEmitter.emit('error', { code: 0, message: '页面滚动的时候, 请暂时不要操作元素!' });
        // }
        const input = this.inputCreatorMap[event.type](event);

        // 跳过无效输入
        // 比如没有按住鼠标左键的移动会返回undefined
        if (void 0 !== input) {
            const AT = `at`;
            const AT_WITH_STATUS = AT + ':' + input.stage;
            this.emit(AT, input as AnyTouchEvent);
            this.emit(AT_WITH_STATUS, input as AnyTouchEvent);

            const { domEvents } = this.options;
            if (false !== domEvents) {
                const { target } = event;
                if (null !== target) {
                    dispatchDomEvent(target, { ...input, type: AT }, domEvents);
                    dispatchDomEvent(target, { ...input, type: AT_WITH_STATUS }, domEvents);
                }
            }

            // input -> computed
            const computed = input as Computed;
            for (const k in this.computeFunctionMap) {
                const f = this.computeFunctionMap[k];
                Object.assign(computed, f(computed));
            }

            // 缓存每次计算的结果
            // 以函数名为键值
            for (const [context, recognize] of this.recognizers) {
                // if (recognizer.disabled) continue;
                // 恢复上次的缓存
                const { name } = context;
                recognize(computed, (type: string) => {
                    // 此时的e就是this.computed
                    const payload = { ...computed, type, baseType: name };

                    // 防止数据被vue类框架拦截
                    Object?.freeze(payload);

                    if (void 0 === this.beforeEachHook) {
                        emit2(this, payload);
                    } else {
                        this.beforeEachHook(context, () => {
                            emit2(this, payload);
                        });
                    }
                });
            }
        }
    };

    /**
     * 使用插件
     * @param {AnyTouchPlugin} 插件
     * @param {Object} 选项
     */
    use(Recognizer: RecognizerFunction, options?: RecognizerOptions): void {
        use(this, Recognizer, options);
    };

    /**
     * 移除插件
     * @param {String} 识别器name
     */
    removeUse(name?: string): void {
        removeUse(this, name);
    };

    /**
     * 事件拦截器
     * @param hook 钩子函数
     */
    beforeEach(hook: (recognizer: RecognizerContext, next: () => void) => void): void {
        this.beforeEachHook = hook;
    };

    /**
     * 获取识别器通过名字
     * @param name 识别器的名字
     * @return 返回识别器
     */
    get(name: string): RecognizerReturn[0] | void {
        return this.recognizerMap[name][0];
    };

    /**
     * 设置
     * @param options 选项
     */
    set(options: Options): void {
        this.options = { ...this.options, ...options };
    };

    /**
     * 销毁
     */
    destroy() {
        // 解绑事件
        this.emit('unbind');
        this.listenersMap = {};
    };
}