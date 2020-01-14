/**
 * ==================== 参考 ====================
 * https://segmentfault.com/a/1190000010511484#articleHeader0
 * https://segmentfault.com/a/1190000007448808#articleHeader1
 * hammer.js http://hammerjs.github.io/
 *
 * ==================== 支持的手势 ====================
 * rotate 旋转
 * pinch 捏合,
 * tap 单机
 * doubleTap 双击
 * press 按压
 * pan 拖拽
 * swipe 快划
 *
 * ==================== 流程 ====================
 * 格式化Event成统一的pointer格式 => 通过pointer数据计算 => 用计算结果去识别手势
 */
import AnyEvent, { Listener } from 'any-event';
import { SupportEvent, Recognizer, AnyTouchPlugin } from '@any-touch/types';
import {
    TOUCH,
    MOUSE,
    SUPPORT_TOUCH,
    TOUCH_START,
    TOUCH_MOVE,
    TOUCH_CANCEL,
    TOUCH_END,
    MOUSE_DOWN,
    MOUSE_MOVE,
    MOUSE_UP,
} from '@any-touch/shared/const';
import Input from './Input';
import { isRegExp, isFunction } from '@any-touch/shared/is';

interface Options {
    hasDomEvents?: boolean;
    isPreventDefault?: boolean;
    // 不阻止默认行为的白名单
    preventDefaultExclude?: RegExp | ((ev: SupportEvent) => boolean);
    syncToAttr?: boolean;
}

// 默认设置
const DEFAULT_OPTIONS: Options = {
    hasDomEvents: true,
    isPreventDefault: true,
    preventDefaultExclude: /^(?:INPUT|TEXTAREA|BUTTON|SELECT)$/,
    syncToAttr: false
};
export default class AnyTouch extends AnyEvent {
    static version = '__VERSION__';
    // static recognizers: Recognizer[] = [new Press(), new Pan(), new Tap(), new Swipe(), new Pinch(), new Rotate()];
    static recognizers: Recognizer[] = [];
    static recognizerMap: Record<string, Recognizer> = {};
    static plugins: AnyTouchPlugin[] = [];
    static use = (plugin: AnyTouchPlugin) => {
        if ('Recognizer' === plugin.type) {
            AnyTouch.recognizers.push(plugin);
            AnyTouch.recognizerMap[plugin.name] = plugin;
        } else {
            AnyTouch.plugins.push(plugin);
        }
    };

    // 目标元素
    el?: HTMLElement;
    // 选项
    options: Options;
    // 输入来源
    sourceType: typeof TOUCH | typeof MOUSE;
    // 统一转换器
    input: Input;

    /**
     * @param {Element} 目标元素, 微信下没有el
     * @param {Object} 选项
     */
    constructor(el?: HTMLElement, options?: Options) {
        super();
        this.el = el;
        this.sourceType = SUPPORT_TOUCH ? TOUCH : MOUSE;
        this.input = new Input(this.sourceType);
        this.options = { ...DEFAULT_OPTIONS, ...options };

        if (void 0 !== this.el) {
            // 绑定事件
            this._unbindEl = this._bindEL(this.el);
        }
    }

    /**
     * 监听input变化s
     * @param {Event}
     */
    catchEvent(event: SupportEvent): void {
        if (this.canPreventDefault(event)) {
            event.preventDefault();
        }
        // if (!event.cancelable) {
        //     this.eventEmitter.emit('error', { code: 0, message: '页面滚动的时候, 请暂时不要操作元素!' });
        // }

        // 统一不同输入
        const input = this.input.transform(event);
        // 跳过无效输入
        // 当是鼠标事件的时候, 会有undefined的时候
        // 比如鼠标还没有mousedown阶段的mousemove等都是无效操作
        if (void 0 !== input) {
            // 管理历史input
            // 生成AnyTouchEvent
            // if (void 0 !== AnyTouch.recognizers[0]) {
            //     AnyTouch.recognizers[0].input = input;
            // }
            this.emit('input', input);
            this.emit(`input${input.inputType}`, input);

            // 缓存每次计算的结果
            // 以函数名为键值
            // console.log(this.recognizers)
            let computedGroup = {};
            for (let recognizer of AnyTouch.recognizers) {
                if (recognizer.disabled) continue;
                recognizer.input = input;

                recognizer.computedGroup = computedGroup;
                recognizer.recognize(input, (type, ev) => {
                    const payload = { ...input, ...ev, type };
                    this.emit(type, payload);
                    this.emitDomEvent(payload);
                });
                computedGroup = recognizer.computedGroup;
            }
        }
    }

    target(el: HTMLElement) {
        return {
            on: (name: string, listener: Listener) => {
                this.on(name, listener, (ev) => ev.target === el);
            }
        };
    }

    /**
     * 触发dom事件
     */
    emitDomEvent(payload: Record<string, any>) {
        if (this.el) {
            // 过滤掉几个Event上保留的字段(target, currentTarget)
            let { target, currentTarget, type, ...data } = payload;
            let event = new Event(type, payload);
            Object.assign(event, data);
            this.el.dispatchEvent(event);
        }
    }

    update() { }

    /**
     * 绑定元素
     * @param {Element} 待绑定手势元素
     */
    private _bindEL(el: Element) {
        const boundInputListener = <EventListener>this.catchEvent.bind(this);

        // Touch
        if (TOUCH === this.sourceType) {
            const events = [TOUCH_START, TOUCH_MOVE, TOUCH_END, TOUCH_CANCEL];
            events.forEach((eventName) => {
                el.addEventListener(eventName, boundInputListener);
            });
            return () => {
                events.forEach((eventName) => {
                    el.removeEventListener(eventName, boundInputListener);
                });
            };
        }
        // Mouse
        else {
            el.addEventListener(MOUSE_DOWN, boundInputListener);
            window.addEventListener(MOUSE_MOVE, boundInputListener);
            window.addEventListener(MOUSE_UP, boundInputListener);
            return () => {
                el.removeEventListener(MOUSE_DOWN, boundInputListener);
                window.removeEventListener(MOUSE_MOVE, boundInputListener);
                window.removeEventListener(MOUSE_UP, boundInputListener);
            };
        }
    }

    /**
     * 获取识别器通过名字
     * @param {String} 识别器的名字
     * @return {Recognizer|undefined} 返回识别器
     */
    get(name: string): Recognizer | undefined {
        return AnyTouch.recognizers.find((recognizer) => name === recognizer.options.name);
    }

    /**
     * 设置
     * @param {Options} 选项
     */
    set(options: Options): void {
        this.options = { ...DEFAULT_OPTIONS, ...options };
        this.update();
    }

    /**
     * 删除识别器
     * @param {String} 识别器name
     */
    remove(recognizerName: string): void {
        for (let [index, recognizer] of AnyTouch.recognizers.entries()) {
            if (recognizerName === recognizer.options.name) {
                AnyTouch.recognizers.splice(index, 1);
                delete AnyTouch.recognizerMap[recognizerName];
                break;
            }
        }
    }

    /**
     * 检查是否需要阻止默认事件, 根据preventDefaultExclude
     * @param {SupportEvent} 原生event
     */
    canPreventDefault(event: SupportEvent): boolean {
        if (!this.options.isPreventDefault) return false;
        let isPreventDefault = false;
        if (null !== event.target) {
            const { preventDefaultExclude } = this.options;
            if (isRegExp(preventDefaultExclude)) {
                const { tagName } = <HTMLElement>event.target;
                if (void 0 !== tagName) {
                    isPreventDefault = !preventDefaultExclude.test(tagName);
                }
            } else if (isFunction(preventDefaultExclude)) {
                isPreventDefault = !preventDefaultExclude(event);
            }
        }
        return isPreventDefault;
    }

    /**
     * 解绑所有触摸事件
     */
    _unbindEl(): void { }

    /**
     * 销毁
     */
    destroy() {
        // 解绑事件
        if (this.el) {
            this._unbindEl();
        }
    }
}
