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
    Recognizer,
    RecognizerFunction,
    RecognizerOptions,
    AnyTouchEvent, SupportEvent, ComputeFunction, InputCreatorFunction, Computed, RecognizerContext
} from '@any-touch/shared';
import {
    TOUCH, MOUSE, RECOGNIZER_STATUS
} from '@any-touch/shared';
import canPassive from './supportsPassive';
import { mouse, touch } from './createInput';
import { dispatchDOMEvents } from './dispatchDomEvent';
import canPreventDefault from './canPreventDefault';
import bindElement from './bindElement';
// type TouchAction = 'auto' | 'none' | 'pan-x' | 'pan-left' | 'pan-right' | 'pan-y' | 'pan-up' | 'pan-down' | 'pinch-zoom' | 'manipulation';

type BeforeEachHook = (recognizerContext: RecognizerContext, map: Record<string, RecognizerContext<any>>, next: () => void) => void;
/**
 * 默认设置
 */
export interface Options {
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
    preventDefaultExclude: /^(?:INPUT|TEXTAREA|BUTTON|SELECT)$/
};

/**
 * 内部事件前缀
 */
const AT = 'at';


/**
 * 创建带插件的AnyTouch函数
 * @param plugins 插件
 */
export function createAnyTouch(plugins: RecognizerFunction[] = []) {
    const AnyTouch = function (el?: HTMLElement, options?: Options) {
        const [on, off, $emit, destroyAE] = AnyEvent<AnyTouchEvent>();

        let _options = { ...DEFAULT_OPTIONS, ...options };
        let _beforeEachHook: BeforeEachHook;

        // 安装插件
        const _computeFunctionMap: Record<string, ComputeFunction> = {};
        let _recognizers: Recognizer[] = [];
        let map: Record<string, RecognizerContext> = {};
        plugins.forEach(plugin => {
            use(plugin)
        });

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
            el.style.webkitTapHighlightColor = 'rgba(0,0,0,0)';
            // 绑定元素
            on(
                'unbind',
                bindElement(
                    el,
                    catchEvent,
                    (!_options.preventDefault && canPassive()) ? { passive: true } : false
                )
            );
        }

        /**
         * 使用插件
         * @param plugin 
         * @param recognizerOptions 
         */
        function use(plugin: RecognizerFunction, recognizerOptions?: RecognizerOptions) {
            const recognizer = plugin(recognizerOptions)
            _recognizers.push(recognizer);
            const { name } = recognizer[0];
            const computeFunctions = recognizer[2]
            map[name] = recognizer[0];
            // 计算函数集合
            computeFunctions.forEach(computeWrapFunction => {
                const { _id } = computeWrapFunction
                // 初始化计算函数
                _computeFunctionMap[_id] = computeWrapFunction();
            });
        }

        /**
         * 事件拦截器
         * @param hook 钩子函数
         */
        function beforeEach(hook: (recognizer: RecognizerContext, map: Record<string, RecognizerContext<any>>, next: () => void) => void): void {
            _beforeEachHook = hook;
        };

        /**
         * 监听input变化
         * @param event Touch / Mouse事件对象
         */
        function catchEvent(event: SupportEvent): void {
            if (canPreventDefault(event, _options)) {
                /* istanbul ignore next */
                event.preventDefault();
            }

            const input = _inputCreatorMap[event.type as (TOUCH | MOUSE)](event);

            // 跳过无效输入
            // 比如没有按住鼠标左键的移动会返回undefined
            if (void 0 !== input) {
                // 内部事件: at, at:start...
                const AT_WITH_STATUS = AT + ':' + input.stage;
                $emit(AT, input as AnyTouchEvent);
                $emit(AT + ':' + input.stage, input as AnyTouchEvent);

                const { target } = event;
                const { domEvents } = _options;
                dispatchDOMEvents(target, [{ ...input, type: AT }, { ...input, type: AT_WITH_STATUS }], domEvents, el);

                // input -> computed
                const computed = input as Computed;
                for (const k in _computeFunctionMap) {
                    const f = _computeFunctionMap[k];
                    Object.assign(computed, f(computed));
                }

                // 缓存每次计算的结果
                // 以函数名为键值
                for (const [context, recognize] of _recognizers) {
                    // if (recognizer.disabled) continue;
                    // 恢复上次的缓存
                    const { name } = context;
                    recognize(computed, (type: string) => {
                        // 此时的e就是this.computed
                        const aEvent = { ...computed, type, name };

                        // 防止数据被vue类框架拦截
                        Object?.freeze(aEvent);

                        if (void 0 === _beforeEachHook) {
                            _emit2(type, aEvent);
                        } else {
                            _beforeEachHook(context, map, () => {
                                _emit2(type, aEvent);
                            });
                        }
                    });
                }
            }
        };

        function _emit2(type: string, aEvent: AnyTouchEvent) {
            const AT_AFTER = `${AT}:after`;
            // 在鼠标下, 此处的target一直是mousedown的target
            // 所以不能改成event.target
            const { target } = aEvent;
            $emit(type, aEvent);
            $emit(AT_AFTER, aEvent);
            // 触发DOM事件
            // 此处的taget是mousedown/touchstart阶段的target
            // 非event.target
            dispatchDOMEvents(target, [aEvent, { ...aEvent, _type: aEvent.type, type: AT_AFTER }], _options.domEvents, el);
        };

        /**
         * 事件委派模式
         * @param el 目标元素
         */
        function target(el: HTMLElement) {
            return {
                on: (eventName: string, listener: Listener<AnyTouchEvent>): void => {
                    on(eventName, listener, event => {
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
            return map[name];
        };

        /**
         * 设置
         * @param options 选项
         */
        function set(options: Options) {
            _options = { ..._options, ...options };
        };


        /**
         * 删除识别器
         * @param at AnyTouch实例
         * @param recognizerName 手势名
         */
        function removeUse(recognizerName?: string): void {
            // 如果没有传入指定手势名称
            // 那么删除所有手势识别器
            if (void 0 === recognizerName) {
                _recognizers = [];
                map = {};
            } else {
                for (const [index, [context]] of _recognizers.entries()) {
                    if (recognizerName === context.name) {
                        _recognizers.splice(index, 1);
                        delete map[recognizerName];
                        break;
                    }
                }
            }
        };

        /**
        * 销毁
        */
        function destroy() {
            // 解绑事件
            $emit('unbind');
            destroyAE();
        };

        return {
            target,
            destroy,
            use,
            get,
            set,
            beforeEach,
            removeUse,
            catchEvent,
            on,
            off
        };
    }

    AnyTouch.version = '__VERSION__';

    type AnyTouchFunction = typeof AnyTouch;
    interface AnyTouchConstructor extends AnyTouchFunction {
        new(el?: HTMLElement, options?: Options): ReturnType<AnyTouchFunction>;
        Tap?: RecognizerFunction;
        Pan?: RecognizerFunction;
        Swipe?: RecognizerFunction;
        Press?: RecognizerFunction;
        Pinch?: RecognizerFunction;
        Rotate?: RecognizerFunction;
        STATUS_POSSIBLE?: RECOGNIZER_STATUS.POSSIBLE;
        STATUS_START?: RECOGNIZER_STATUS.START;
        STATUS_MOVE?: RECOGNIZER_STATUS.MOVE;
        STATUS_END?: RECOGNIZER_STATUS.END;
        STATUS_CANCELLED?: RECOGNIZER_STATUS.CANCELLED;
        STATUS_FAILED?: RECOGNIZER_STATUS.FAILED;
        STATUS_RECOGNIZED?: RECOGNIZER_STATUS.RECOGNIZED;
    }
    return AnyTouch as AnyTouchConstructor;
}
export default createAnyTouch();
