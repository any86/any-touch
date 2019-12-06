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

import { AEvent, AnyTouchEvent, SupportEvent, CSSPreventMap } from '@/types';
import { TOUCH, MOUSE, SUPPORT_TOUCH, NONE, AUTO, TOUCH_START, TOUCH_MOVE, TOUCH_CANCEL, TOUCH_END, MOUSE_DOWN, MOUSE_MOVE, MOUSE_UP, COMPUTE } from '@/const';
import InputManage from '@/InputManage';
import computeTouchAction from '@/utils/computeTouchAction';
import Store from '@/Store';
import { isRegExp, isFunction } from '@/utils/is';
import compute from '@/compute';
// 识别器
import Recognizer from '@/recognitions/Base';
import Tap from '@/recognitions/Tap';
import Press from '@/recognitions/Press';
import Pan from '@/recognitions/Pan';
import Swipe from '@/recognitions/Swipe';
import Pinch from '@/recognitions/Pinch';
import Rotate from '@/recognitions/Rotate';
import * as Vector from '@/vector';
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
export default class {
    // 识别器
    static Tap = Tap;
    static Press = Press;
    static Pan = Pan;
    static Swipe = Swipe;
    static Pinch = Pinch;
    static Rotate = Rotate;
    static version = '__VERSION__';

    // 向量计算
    static Vector = Vector;

    // mini的事件触发器
    static EventEmitter = AnyEvent;

    // 目标元素
    el?: HTMLElement;

    default: Options;

    touchDevice: string;

    recognizers: Recognizer[];

    options: Options;

    eventEmitter: AnyEvent;

    inputManage: InputManage;

    $store: Store;

    _root: any;

    event: Record<string, any>;

    // 是否阻止后面的识别器运行
    private _isStopped: boolean;

    /**
     * @param {Element} 目标元素
     * @param {Object} 选项
     */
    constructor(el?: HTMLElement, options?: Options) {
        this.default = {
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
        if (undefined !== el) this.el = el;
        this.event = {};
        this.$store = new Store();
        this.inputManage = new InputManage();
        this.touchDevice = SUPPORT_TOUCH ? TOUCH : MOUSE;
        this.options = { ...this.default, ...options };
        // eventEmitter
        this.eventEmitter = new AnyEvent();
        this._isStopped = false;
        // 识别器
        // 注入当前方法和属性, 方便在识别器中调用类上的方法和属性
        // fix: 不注入this, 因为微信下回报错, 提示对象里有循环引用
        const root = {
            eventEmitter: this.eventEmitter,
            options: this.options,
            el, $store: this.$store,
            update: this.update.bind(this)
        };
        this._root = root;
        this.recognizers = [
            // new Rotate().$injectRoot(root),
            // new Pinch().$injectRoot(root),
            new Pan().$injectRoot(root),
            // new Swipe().$injectRoot(root),
            // new Tap().$injectRoot(root),
            // new Tap({
            //     name: 'doubletap',
            //     pointLength: 1,
            //     tapTimes: 2,
            //     disabled: true
            // }).$injectRoot(root),
            // new Press().$injectRoot(root),
        ];
        // 默认单击需要双击识别失败后触发
        // this.recognizers[4].requireFailure(this.recognizers[5]);
        if (undefined !== this.el) {
            // 应用设置
            this.update();
            // 绑定事件
            this._unbindEl = this._bindEL(this.el)._unbindEl;
        }
    };

    /**
     * 刷新设备类型, 一般没什么用, 主要为了模拟器下切换pc/手机可以切换识别器
     * at.refresh();
     */
    // refresh() {
    //     if (undefined === this.el) return;
    //     this._unbindEl()
    //     this.touchDevice = ('ontouchstart' in window) ? 'touch' : 'mouse';
    //     this._unbindEl = this._bindEL(this.el)._unbindEl;
    // };

    /**
     * 计算touch-action
     * @param {HTMLElement} 目标元素 
     */
    updateTouchAction() {
        // console.warn(this.options.touchAction);
        if (COMPUTE === this.options.touchAction) {
            let touchActions = [];
            for (let recognizer of this.recognizers) {
                touchActions.push(...recognizer.getTouchAction());
            };
            this.el!.style.touchAction = computeTouchAction(touchActions);
        } else {
            this.el!.style.touchAction = this.options.touchAction || AUTO;
        }
    };

    /**
     * 设置"阻止浏览器默认行为"的css样式
     */
    updateCssPrevent() {
        const style = <CSSPreventMap>{};
        const { cssPrevent } = this.options;
        if (undefined === cssPrevent) return;
        if (cssPrevent.selectText) {
            style['mozUserSelect'] = NONE;
            style['userSelect'] = NONE;
            style['msUserSelect'] = NONE;
            style['webkitUserSelect'] = NONE;
            style['msTouchSelect'] = NONE;
        }

        if (cssPrevent.drag) {
            style['webkitUserDrag'] = NONE;
        }

        if (cssPrevent.tapHighlight) {
            style['webkitTapHighlightColor'] = 'rgba(0,0,0,0)';
        }

        if (cssPrevent.callout) {
            style['webkitTouchCallout'] = NONE;
        }
        // 设置
        for (let k in style) {
            this.el!.style[k] = style[k];
        }
    };

    /**
     * 更新设置
     */
    public update() {
        if (undefined === this.el) return;
        this.updateTouchAction();
        this.updateCssPrevent();
    };

    /**
     * 绑定手势到指定元素
     * 暂时只支持事件冒泡阶段触发, 
     * 改为捕获阶段需要对inputListener进行编号, 
     * 产生大量事件绑定,
     * 而非在一次触发事件中执行所有手势判断
     * @param {Element} 待绑定手势元素
     */
    private _bindEL(el: Element) {
        const boundInputListener = <EventListener>this.catchEvent.bind(this);

        // Touch
        if (TOUCH === this.touchDevice) {
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
        recognizer.$injectRoot(this._root);
        const hasSameName = this.recognizers.some((theRecognizer: Recognizer) => recognizer.name === theRecognizer.name);
        if (hasSameName) {
            this.eventEmitter.emit('error', { code: 1, message: `${recognizer.name}识别器已经存在!` })
        } else {
            this.recognizers.push(recognizer);
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
        this.options = { ...this.default, ...options };
        this.update();
    };

    /**
     * 停止识别
     */
    stop() {
        this._isStopped = true;
    }

    /**
     * 删除识别器
     * @param {String} 识别器name
     */
    remove(recognizerName: string): void {
        for (let [index, recognizer] of this.recognizers.entries()) {
            if (recognizerName === recognizer.options.name) {
                this.recognizers.splice(index, 1);
                break;
            }
        }
    };

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

        // 管理历史input
        // 生成AnyTouchEvent
        const inputRecord = this.inputManage.load(event);

        // 跳过无效输入
        // 当是鼠标事件的时候, 会有undefined的时候
        // 比如鼠标还没有mousedown阶段的mousemove等都是无效操作
        if (void 0 !== inputRecord) {
            const { input } = inputRecord;
            const { id } = input;
            // const computed = compute(inputRecord, this.$store)
            // // input事件
            // this.emit('input', computed);
            // if (computed.isStart) {
            //     // 重置isStopped
            //     this._isStopped = false;
            // }
            // 每次事件触发重新生成event
            this.event = { id };
            for (let recognizer of this.recognizers) {
                if (recognizer.disabled) continue;
                // 如果遇到停止标记, 立即停止运行后面的识别器
                recognizer.event = this.event;
                // 每个识别器的test方法会设置event的值
                recognizer.recognize(inputRecord);

                if (this._isStopped) {
                    break;
                }
            }
        }

    };

    /**
     * 注册事件
     * @param {String} 事件名
     * @param {Function} 回调函数
     */
    on(type: string, listener: (event: AnyTouchEvent) => void, options: { [k: string]: boolean } | boolean = false): void {
        this.eventEmitter.on(type, listener);
    };

    /**
     * 解绑事件
     * @param {String} 事件名 
     * @param {Function} 事件回调
     */
    off(type: string, listener?: (event: AnyTouchEvent) => void): void {
        this.eventEmitter.off(type, listener);
    };

    /**
     * 触发事件, 同时type会作为payload的一个键值
     * @param {String} 类型名
     * @param {Object} 数据
     */
    emit(type: string, payload: AnyTouchEvent) {
        this.eventEmitter.emit(type, { ...payload, type });
    };

    /**
     * 解绑所有触摸事件
     */
    _unbindEl(): void { };

    /**
     * 销毁
     */
    destroy() {
        this.$store.destroy();
        // 解绑事件
        if (this.el) {
            this._unbindEl();
        }
        this.eventEmitter.destroy();
    };
};