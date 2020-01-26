/**
 * 主程序, 不包含手势,
 * 主要用来适配Mouse/Touch事件
 * ==================== 参考 ====================
 * https://segmentfault.com/a/1190000010511484#articleHeader0
 * https://segmentfault.com/a/1190000007448808#articleHeader1
 * hammer.js http://hammerjs.github.io/
 */
import AnyEvent, { Listener } from 'any-event';
import { SupportEvent, Recognizer, AnyTouchPlugin } from '@any-touch/shared';
import {
    TOUCH,
    MOUSE,
    SUPPORT_TOUCH,
} from '@any-touch/shared';

import Input from './Input';
import dispatchDomEvent from './dispatchDomEvent';
import canPreventDefault from './canPreventDefault';
import bindElement from './bindElement';

export interface Options {
    hasDomEvents?: boolean;
    isPreventDefault?: boolean;
    // 不阻止默认行为的白名单
    preventDefaultExclude?: RegExp | ((ev: SupportEvent) => boolean);
}

// 默认设置
const DEFAULT_OPTIONS: Options = {
    hasDomEvents: true,
    isPreventDefault: true,
    preventDefaultExclude: /^(?:INPUT|TEXTAREA|BUTTON|SELECT)$/,
};
export default class AnyTouch extends AnyEvent {
    static version = '__VERSION__';
    static recognizers: Recognizer[] = [];
    static recognizerMap: Record<string, Recognizer> = {};
    static plugins: AnyTouchPlugin[] = [];
    /**
     * 安装插件
     */
    static use = (plugin: AnyTouchPlugin, options?: Record<string, any>): void => {
        if ('Recognizer' === plugin.type) {
            const instance = new plugin(options);
            // console.warn(instance)
            AnyTouch.recognizerMap[instance.name] = instance;
            AnyTouch.recognizers.push(AnyTouch.recognizerMap[instance.name]);
        } else {
            AnyTouch.plugins.push(plugin);
        }
    };

    /**
     * 卸载插件
     */
    static removeUse = (recognizerName: string): void => {
        for (const [index, recognizer] of AnyTouch.recognizers.entries()) {
            if (recognizerName === recognizer.options.name) {
                AnyTouch.recognizers.splice(index, 1);
                delete AnyTouch.recognizerMap[recognizerName];
                break;
            }
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

    recognizerMap: Record<string, Recognizer> = {};
    recognizers: Recognizer[] = [];
    plugins: AnyTouchPlugin[] = [];
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
            const boundInputListener = this.catchEvent.bind(this);
            this._unbindEl = bindElement(this.el, boundInputListener);
        }
    };

    /**
     * 使用插件
     * @param {AnyTouchPlugin} 插件 
     * @param {Object} 选项 
     */
    use(plugin: AnyTouchPlugin, options?: Record<string, any>): void {
        AnyTouch.use(plugin, options);
    };

    /**
     * 监听input变化s
     * @param {Event}
     */
    catchEvent(event: SupportEvent): void {
        if (canPreventDefault(event, this.options)) {
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
            this.emit('at:input', input);
            this.emit(`at:input${input.inputType}`, input);

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
                    if (void 0 !== this.el) {
                        dispatchDomEvent(this.el, payload);
                    }
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
    }

    /**
     * 移除插件
     * @param {String} 识别器name
     */
    removeUse(name: string): void {
        AnyTouch.removeUse(name);
    }

    /**
     * 解绑所有触摸事件
     */
    private _unbindEl(): void { }

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