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
    TOUCH, MOUSE,RECOGNIZER_STATUS
} from '@any-touch/shared';

import { mouse, touch } from './createInput';
import dispatchDomEvent from './dispatchDomEvent';
import canPreventDefault from './canPreventDefault';
import bindElement from './bindElement';
import { use, removeUse } from './use';
// type TouchAction = 'auto' | 'none' | 'pan-x' | 'pan-left' | 'pan-right' | 'pan-y' | 'pan-up' | 'pan-down' | 'pinch-zoom' | 'manipulation';


interface AnyTouchFunction {
    version?: string;
    Tap?: RecognizerFunction;
    Pan?: RecognizerFunction;
    Swipe?: RecognizerFunction;
    Press?: RecognizerFunction;
    Pinch?: RecognizerFunction;
    Rotate?: RecognizerFunction;
    STATUS_POSSIBLE?: RECOGNIZER_STATUS;
    STATUS_START?: RECOGNIZER_STATUS;
    STATUS_MOVE?: RECOGNIZER_STATUS;
    STATUS_END?: RECOGNIZER_STATUS;
    STATUS_CANCELLED?: RECOGNIZER_STATUS;
    STATUS_FAILED?: RECOGNIZER_STATUS;
    STATUS_RECOGNIZED?: RECOGNIZER_STATUS;
    computeFunctionMap?: Record<string, ComputeWrapFunction>;
    recognizers?: RecognizerReturn[];
    recognizerMap?: Record<string, RecognizerContext>;
    use: (Recognizer: RecognizerFunction, options?: RecognizerOptions) => void;
    removeUse: (recognizerName?: string) => void;
    (el?: HTMLElement, options?: Options): any;
    new(el?: HTMLElement, options?: Options): any;
}


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

export function createAnyTouch(preset?: RecognizerFunction[]) {
    function AnyTouch(el?: HTMLElement, options?: Options) {
        const [$on, $off, $emit, anyEventDestroy] = AnyEvent<AnyTouchEvent>();
        let _options = { ...DEFAULT_OPTIONS, ...options };
        let _beforeEachHook: BeforeEachHook;
        // 计算函数集合
        const _computeFunctionMap: Record<string, ComputeFunction> = {};
        // 同步通过静态方法use引入的手势附带的"计算函数"
        for (const k in AnyTouch.computeFunctionMap) {
            _computeFunctionMap[k] = AnyTouch.computeFunctionMap[k]();
        }
        // 同步插件到实例
        const recognizerMap = AnyTouch.recognizerMap as Record<string, RecognizerContext>;
        const recognizers = AnyTouch.recognizers as RecognizerReturn[];

        // 之所以强制是InputCreatorFunction<SupportEvent>,
        // 是因为调用this.inputCreatorMap[event.type]的时候还要判断类型,
        // 因为都是固定(touch&mouse)事件绑定好的, 没必要判断
        const createInputFromTouch = touch(el) as InputCreatorFunction<SupportEvent>;
        const createInputFromMouse = mouse() as InputCreatorFunction<SupportEvent>;
        const _inputCreatorMap = {
            [TOUCH.START]: createInputFromTouch,
            [TOUCH.MOVE]: createInputFromTouch,
            [TOUCH.END]: createInputFromTouch,
            [TOUCH.CANCEL]: createInputFromTouch,
            [MOUSE.DOWN]: createInputFromMouse,
            [MOUSE.MOVE]: createInputFromMouse,
            [MOUSE.UP]: createInputFromMouse
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
            $on(
                'unbind',
                bindElement(
                    el,
                    catchEvent,
                    !_options.isPreventDefault && supportsPassive ? { passive: true } : false
                )
            );
        }

        /**
         * 事件拦截器
         * @param hook 钩子函数
         */
        function beforeEach(hook: (recognizer: RecognizerContext, next: () => void) => void): void {
            _beforeEachHook = hook;
        };

        /**
         * 监听input变化s
         * @param event Touch / Mouse事件对象
         */
        function catchEvent(event: SupportEvent): void {
            if (canPreventDefault(event, _options)) {
                event.preventDefault();
            }

            const input = _inputCreatorMap[event.type as (TOUCH | MOUSE)](event);

            // 跳过无效输入
            // 比如没有按住鼠标左键的移动会返回undefined
            if (void 0 !== input) {
                const AT = `at`;
                const AT_WITH_STATUS = AT + ':' + input.stage;
                $emit(AT, input as AnyTouchEvent);
                $emit(AT_WITH_STATUS, input as AnyTouchEvent);

                const { domEvents } = _options;
                if (false !== domEvents) {
                    const { target } = event;
                    if (null !== target) {
                        dispatchDomEvent(target, { ...input, type: AT }, domEvents);
                        dispatchDomEvent(target, { ...input, type: AT_WITH_STATUS }, domEvents);
                    }
                }

                // input -> computed
                const computed = input as Computed;
                for (const k in _computeFunctionMap) {
                    const f = _computeFunctionMap[k];
                    Object.assign(computed, f(computed));
                }

                // 缓存每次计算的结果
                // 以函数名为键值
                for (const [context, recognize] of recognizers) {
                    // if (recognizer.disabled) continue;
                    // 恢复上次的缓存
                    const { name } = context;
                    recognize(computed, (type: string) => {
                        // 此时的e就是this.computed
                        const payload = { ...computed, type, name };

                        // 防止数据被vue类框架拦截
                        Object?.freeze(payload);

                        if (void 0 === _beforeEachHook) {
                            _emit2(payload);
                        } else {
                            _beforeEachHook(context, () => {
                                _emit2(payload);
                            });
                        }
                    });
                }
            }
        };

        function _emit2(payload: AnyTouchEvent) {
            const AT_AFTER = 'at:after';
            const { type, target } = payload;
            $emit(type, payload);
            $emit(AT_AFTER, payload);
            // 触发DOM事件
            if (!!_options.domEvents
                && void 0 !== el
                && null !== target
            ) {
                // vue会把绑定元素的所有子元素都进行事件绑定
                // 所以此处的target会自动冒泡到目标元素
                dispatchDomEvent(target, payload, _options.domEvents);
                dispatchDomEvent(target, { ...payload, _type: payload.type, type: AT_AFTER }, _options.domEvents);
            }
        };

        function target(el: HTMLElement) {
            return {
                on: (eventName: string, listener: Listener<AnyTouchEvent>): void => {
                    $on(eventName, listener, event => {
                        const { targets } = event;
                        // 检查当前触发事件的元素是否是其子元素
                        return event.target === el &&
                            targets.every((target) => el.contains(target as HTMLElement))
                    });
                }
            };
        };

        /**
         * 获取识别器通过名字
         * @param name 识别器的名字
         * @return 返回识别器
         */
        function get(name: string): RecognizerContext | void {
            return recognizerMap[name];
        };
        /**
             * 设置
             * @param options 选项
             */
        function set(options: Options) {
            _options = { ..._options, ...options };
        };

        function _use(Recognizer: RecognizerFunction, options?: RecognizerOptions) {
            use({ recognizerMap, recognizers, computeFunctionMap: _computeFunctionMap }, Recognizer, options);
        };

        /**
         * 移除插件
         * @param {String} 识别器name
         */
        function _removeUse(name?: string) {
            const context: any = { recognizerMap, recognizers };
            removeUse(context, name);
        };

        /**
        * 销毁
        */
        function destroy() {
            // 解绑事件
            $emit('unbind');
            anyEventDestroy();
        };

        return {
            target,
            destroy,
            use: _use,
            get,
            set,
            beforeEach,
            removeUse: _removeUse,
            recognizers,
            recognizerMap,
            catchEvent,
            on: $on,
            off: $off
        };
    }

    AnyTouch.computeFunctionMap = {} as Record<string, ComputeWrapFunction>;
    AnyTouch.recognizerMap = {} as Record<string, RecognizerContext>;
    AnyTouch.recognizers = [] as RecognizerReturn[];
    /**
     * 安装插件
     * @param {AnyTouchPlugin} 插件
     * @param {any[]} 插件参数
     */
    AnyTouch.use = (Recognizer: RecognizerFunction, options?: RecognizerOptions): void => {
        use(AnyTouch, Recognizer, options);
    };

    /**
     * 卸载插件[不建议]
     */
    AnyTouch.removeUse = (recognizerName?: string): void => {
        removeUse(AnyTouch, recognizerName);
    };

    AnyTouch.version = '__VERSION__';

    return AnyTouch;
}

export default createAnyTouch() as AnyTouchFunction;
