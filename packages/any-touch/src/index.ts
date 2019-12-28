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
import AnyEvent from 'any-event';
import { AnyTouchEvent, SupportEvent, Recognizer } from '@types';
import { TOUCH, MOUSE, SUPPORT_TOUCH, NONE, AUTO, TOUCH_START, TOUCH_MOVE, TOUCH_CANCEL, TOUCH_END, MOUSE_DOWN, MOUSE_MOVE, MOUSE_UP, COMPUTE, } from './const';
import Input from './Input';
import { isRegExp, isFunction } from '@shared/is';
import Pan from '@any-touch/Pan'
import Tap from '@any-touch/Tap'
import Swipe from '@any-touch/Swipe'
import Pinch from '@any-touch/Pinch'
import Rotate from '@any-touch/Rotate'

interface Options {
    touchAction?: 'compute' | 'auto' | 'manipulation' | 'pan-x' | 'pan-y' | 'none';
    hasDomEvents?: boolean;
    isPreventDefault?: boolean;
    // 不阻止默认行为的白名单
    preventDefaultExclude?: RegExp | ((ev: SupportEvent) => boolean);
    syncToAttr?: boolean;
    cssPrevent?: {
        // 阻止触发选择文字
        selectText?: boolean;
        // 阻止触发浏览器默认拖拽
        drag?: boolean;
        // 隐藏高亮效果
        tapHighlight?: boolean;
        // 阻止默认菜单
        callout?: boolean;
    }
};

// 默认设置
const DEFAULT_OPTIONS: Options = {
    touchAction: COMPUTE,
    hasDomEvents: true,
    isPreventDefault: true,
    preventDefaultExclude: /^(?:INPUT|TEXTAREA|BUTTON|SELECT)$/,
    syncToAttr: false,
    cssPrevent: {
        // 阻止触发选择文字
        selectText: true,
        // 阻止触发浏览器默认拖拽
        drag: true,
        // 隐藏高亮效果
        tapHighlight: true,
        // 阻止默认菜单
        callout: true
    }
};
export default class AnyTouch extends AnyEvent {
    static version = '__VERSION__';

    // 目标元素
    el?: HTMLElement;
    // 选项
    options: Options;

    sourceType: typeof TOUCH | typeof MOUSE;

    // 识别器
    recognizers: Recognizer[];
    recognizerMap: Record<string, Recognizer>;

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

        // 识别器
        this.recognizers = [new Pan(), new Tap(), new Swipe(), new Pinch() , new Rotate()];
        this.recognizerMap = {};

        if (void 0 !== this.el) {
            // 应用设置
            // this.update();
            // 绑定事件
            this._unbindEl = this._bindEL(this.el)._unbindEl;
        }
    };

    use(recognizer: Recognizer) {
        this.recognizers.push(recognizer);
    };

    update() { };

    /**
     * 绑定元素
     * @param {Element} 待绑定手势元素
     */
    private _bindEL(el: Element) {
        const boundInputListener = <EventListener>this.catchEvent.bind(this);

        // Touch
        if (TOUCH === this.sourceType) {
            const events = [TOUCH_START, TOUCH_MOVE, TOUCH_END, TOUCH_CANCEL];
            events.forEach(eventName => {
                el.addEventListener(eventName, boundInputListener);
            });
            return {
                _unbindEl: () => {
                    events.forEach(eventName => {
                        el.removeEventListener(eventName, boundInputListener);
                    });
                }
            }
        }
        // Mouse
        else {
            el.addEventListener(MOUSE_DOWN, boundInputListener);
            window.addEventListener(MOUSE_MOVE, boundInputListener);
            window.addEventListener(MOUSE_UP, boundInputListener);
            return {
                _unbindEl: () => {
                    el.removeEventListener(MOUSE_DOWN, boundInputListener);
                    window.removeEventListener(MOUSE_MOVE, boundInputListener);
                    window.removeEventListener(MOUSE_UP, boundInputListener);
                }
            };
        }
    };

    /**
     * 添加识别器
     * @param recognizer 识别器
     */
    add(recognizer: Recognizer): void {
        const hasSameName = this.recognizers.some((theRecognizer: Recognizer) => recognizer.name === theRecognizer.name);
        if (hasSameName) {
            // this.eventEmitter.emit('error', { code: 1, message: `${recognizer.name}识别器已经存在!` })
        } else {
            this.recognizers.push(recognizer);
            this.recognizerMap[recognizer.name] = recognizer;
            this.update();
        }
    };

    /**
     * 获取识别器通过名字
     * @param {String} 识别器的名字
     * @return {Recognizer|undefined} 返回识别器
     */
    get(name: string): Recognizer | undefined {
        return this.recognizers.find(recognizer => name === recognizer.options.name);
    };

    /**
     * 设置
     * @param {Options} 选项 
     */
    set(options: Options): void {
        this.options = { ...DEFAULT_OPTIONS, ...options };
        this.update();
    };

    /**
     * 停止识别
     */
    stop() {
    }

    /**
     * 删除识别器
     * @param {String} 识别器name
     */
    remove(recognizerName: string): void {
        for (let [index, recognizer] of this.recognizers.entries()) {
            if (recognizerName === recognizer.options.name) {
                this.recognizers.splice(index, 1);
                delete this.recognizerMap[recognizerName];
                break;
            }
        }
    };

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
                const { tagName } = (<HTMLElement>event.target);
                if (void 0 !== tagName) {
                    isPreventDefault = !preventDefaultExclude.test(tagName);
                }
            } else if (isFunction(preventDefaultExclude)) {
                isPreventDefault = !preventDefaultExclude(event)
            }
        }
        return isPreventDefault;
    };

    /**
     * 监听input变化
     * @param {Event}
     */
    catchEvent(event: SupportEvent): void {
        if (this.canPreventDefault(event)) {
            event.preventDefault();
        }
        // if (!event.cancelable) {
        //     this.eventEmitter.emit('error', { code: 0, message: '页面滚动的时候, 请暂时不要操作元素!' });
        // }
        // 跳过无效输入
        // 当是鼠标事件的时候, 会有undefined的时候
        // 比如鼠标还没有mousedown阶段的mousemove等都是无效操作
        const input = this.input.transform(event);

        if (void 0 !== input) {
            // 管理历史input
            // 生成AnyTouchEvent
            if (void 0 !== this.recognizers[0]) {
                this.recognizers[0].input = input;
            }
            this.emit('input', input);
            // 缓存每次计算的结果
            // 以函数名为键值
            // console.log(this.recognizers)
            let computedGroup = {};
            for (let recognizer of this.recognizers) {
                if (recognizer.disabled) continue;
                recognizer.computedGroup = computedGroup;
                recognizer.recognize(input, (type, ev) => {
                    this.emit(type, { ...input, ...ev, type });
                });
                computedGroup = recognizer.computedGroup;
            }
        }

        //     // 每次事件触发重新生成event
        //     this.event = input;

        //     // 缓存每次计算的结果
        //     let computed = {};

        //     // input事件
        //     this.emit('input', this.event);
        //     if (input.isStart) {
        //         // 重置isStopped
        //         // this._isStopped = false;
        //     }

        //     for (let recognizer of this.recognizers) {
        //         if (recognizer.disabled) continue;
        //         recognizer.computed = computed;
        //         // 如果遇到停止标记, 立即停止运行后面的识别器
        //         recognizer.event = this.event;
        //         // 每个识别器的test方法会设置event的值
        //         recognizer.recognize(input);
        //         computed = recognizer.computed;
        //         // if (this._isStopped) {
        //         //     break;
        //         // }
        //     }
        // }

    };

    /**
     * 解绑所有触摸事件
     */
    _unbindEl(): void { };

    /**
     * 销毁
     */
    destroy() {
        // 解绑事件
        if (this.el) {
            this._unbindEl();
        }
    };
};

