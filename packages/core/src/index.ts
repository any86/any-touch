/**
 * 主程序, 不包含手势,
 * 主要用来适配Mouse/Touch事件
 * ==================== 参考 ====================
 * https://segmentfault.com/a/1190000010511484#articleHeader0
 * https://segmentfault.com/a/1190000007448808#articleHeader1
 * hammer.js http://hammerjs.github.io/
 */
import AnyEvent from 'any-event';
import type { SupportEvent, Recognizer } from '@any-touch/shared';
import { TOUCH, IS_WX } from '@any-touch/shared';

import { mouse, touch } from './createInput';
import dispatchDomEvent from './dispatchDomEvent';
import canPreventDefault from './canPreventDefault';
import bindElement from './bindElement';
import { use, removeUse } from './use';
import emit2 from './emit2';
// type TouchAction = 'auto' | 'none' | 'pan-x' | 'pan-left' | 'pan-right' | 'pan-y' | 'pan-up' | 'pan-down' | 'pinch-zoom' | 'manipulation';


type BeforeEachHook = (recognizer: Recognizer, next: () => void) => void;
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

export default class AnyTouch extends AnyEvent {
    static version = '__VERSION__';
    static recognizers: Recognizer[] = [];
    static recognizerMap: Record<string, Recognizer> = {};
    /**
     * 安装插件
     * @param {AnyTouchPlugin} 插件
     * @param {any[]} 插件参数
     */
    static use = (Recognizer: new (...args: any) => Recognizer, options?: Record<string, any>): void => {
        use(AnyTouch, Recognizer, options);
    };
    /**
     * 卸载插件
     */
    static removeUse = (recognizerName?: string): void => {
        removeUse(AnyTouch, recognizerName);
    };

    // 目标元素
    el?: HTMLElement;
    // 选项
    options: Options;

    recognizerMap: Record<string, Recognizer> = {};
    recognizers: Recognizer[] = [];
    beforeEachHook?: BeforeEachHook;
    cacheComputedFunctionGroup = Object.create(null);
    /**
     * @param {Element} 目标元素, 微信下没有el
     * @param {Object} 选项
     */
    constructor(el?: HTMLElement, options?: Options) {
        super();
        this.el = el;


        this.options = { ...DEFAULT_OPTIONS, ...options };

        // 同步到插件到实例
        this.recognizerMap = AnyTouch.recognizerMap;
        this.recognizers = AnyTouch.recognizers;

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
            } catch{ }

            const inputCreator = [touch(this.el), mouse()];
            if (!IS_WX) inputCreator.pop();

            // 绑定元素
            this.on(
                'unbind',
                bindElement(
                    el,
                    this.catchEvent.bind(this),
                    inputCreator,
                    !this.options.isPreventDefault && supportsPassive ? { passive: true } : false
                )
            );
        }
    }

    /**
     * 使用插件
     * @param {AnyTouchPlugin} 插件
     * @param {Object} 选项
     */
    use(Recognizer: new (...args: any) => Recognizer, options?: Record<string, any>): void {
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
     * 监听input变化s
     * @param {Event}
     */
    catchEvent(event: SupportEvent, createInput?: any): void {
        if (canPreventDefault(event, this.options)) {
            event.preventDefault();
        }
        // if (!event.cancelable) {
        //     this.eventEmitter.emit('error', { code: 0, message: '页面滚动的时候, 请暂时不要操作元素!' });
        // }
        const input = createInput(event);

        // 跳过无效输入
        // 比如没有按住鼠标的移动会返回undefined
        if (void 0 !== input) {
            const AT_TOUCH = `at:${TOUCH}`;
            const AT_TOUCH_WITH_STATUS = AT_TOUCH + input.stage;
            this.emit(AT_TOUCH, input);
            this.emit(AT_TOUCH_WITH_STATUS, input);

            const { domEvents } = this.options;
            if (false !== domEvents) {
                const { target } = event;
                if (null !== target) {
                    dispatchDomEvent(target, { ...input, type: AT_TOUCH }, domEvents);
                    dispatchDomEvent(target, { ...input, type: AT_TOUCH_WITH_STATUS }, domEvents);
                }
            }
            // 缓存每次计算的结果
            // 以函数名为键值
            let cacheComputedGroup = Object.create(null);
            for (const recognizer of this.recognizers) {
                if (recognizer.disabled) continue;
                // 恢复上次的缓存
                recognizer.computedGroup = cacheComputedGroup;
                recognizer.computeFunctionMap = this.cacheComputedFunctionGroup;
                recognizer.recognize(input, (type, ev) => {
                    // 此时的ev就是this.computed
                    const payload = { ...input, ...ev, type, baseType: recognizer.name };

                    // 防止数据被vue类框架拦截
                    Object.freeze(payload);

                    if (void 0 === this.beforeEachHook) {
                        emit2(this, payload);
                    } else {
                        this.beforeEachHook(recognizer, () => {
                            emit2(this, payload);
                        });
                    }
                });
                // 记录到缓存
                cacheComputedGroup = recognizer.computedGroup;
                this.cacheComputedFunctionGroup = recognizer.computeFunctionMap;
            }
        }
    };

    /**
     * 事件拦截器
     * @param hook 钩子函数
     */
    beforeEach(hook: (recognizer: Recognizer, next: () => void) => void): void {
        this.beforeEachHook = hook;
    };

    /**
     * 获取识别器通过名字
     * @param name 识别器的名字
     * @return 返回识别器
     */
    get(name: string): Recognizer | void {
        return this.recognizerMap[name];
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