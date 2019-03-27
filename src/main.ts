/**
 * ==================== 参考 ====================
 * https://segmentfault.com/a/1190000010511484#articleHeader0
 * https://segmentfault.com/a/1190000007448808#articleHeader1
 * hammer.js
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
import { Computed } from './interface';
import { SUPPORT_TOUCH } from './const'; ``
import InputManage from './InputManage';
import compute from './compute/index';
import computeTouchAction from './untils/computeTouchAction'
// 识别器
import Tap from './recognitions/Tap';
import Press from './recognitions/Press';
import Pan from './recognitions/Pan';
import Swipe from './recognitions/Swipe';
import Pinch from './recognitions/Pinch';
import Rotate from './recognitions/Rotate';
import * as Vector from './vector';
interface Options {
    touchAction?: 'compute' | 'auto' | 'manipulation' | 'pan-x' | 'pan-y' | 'none';
    hasDomEvents?: boolean;
    isPreventDefault?: boolean;
    style?: { [key: string]: string };
};
export default class AnyTouch {
    // 识别器
    static Tap = Tap;
    static Press = Press;
    static Pan = Pan;
    static Swipe = Swipe;
    static Pinch = Pinch;
    static Rotate = Rotate;

    // 向量计算
    static Vector = Vector;

    // mini的事件触发器
    static EventEmitter = AnyEvent;

    // 目标元素
    el: HTMLElement;

    default: Options;

    inputType: string;

    recognizers: { [propName: string]: any, name: string }[];

    options: Options;

    version: string;

    eventEmitter: any;

    inputManage: any;

    // 是否阻止后面的识别器运行
    private _isStopped: boolean;

    /**
     * @param {Element} 目标元素
     * @param {Object} 选项
     */
    constructor(el: HTMLElement, options?: Options) {
        this.version = '__VERSION__';
        
        this.default = {
            touchAction: 'compute',
            hasDomEvents: true,
            isPreventDefault: false,
            style: {
                // 禁用选择文字
                '-moz-user-select': 'none',
                ' -webkit-user-select': 'none',
                '-ms-user-select': 'none',
                'user-select': 'none',
                // https://developer.mozilla.org/en-US/docs/Web/CSS/-ms-touch-select
                // 禁用选择文字, 在winphone下
                '-ms-touch-select': 'none',
                // 点击元素的高亮颜色配置
                '-webkit-tap-highlight-color': 'rgba(0,0,0,0)',
                ' -webkit-user-drag': 'none',
                // 当你触摸并按住触摸目标时候，
                // 禁止或显示系统默认菜单。
                // 在iOS上，当你触摸并按住触摸的目标，
                // 比如一个链接，Safari浏览器将显示链接有关的系统默认菜单。
                // 这个属性可以让你禁用系统默认菜单。
                '-webkit-touch-callout': 'none'
            }
        };
        this.el = el;
        this.inputManage = new InputManage();
        this.inputType = SUPPORT_TOUCH ? 'touch' : 'mouse';
        this.options = { ...this.default, ...options };
        // eventEmitter
        this.eventEmitter = new AnyEvent();
        this._isStopped = false;
        // 识别器
        // 注入当前方法和属性, 方便在识别器中调用类上的方法和属性
        this.recognizers = [
            new Rotate().$injectRoot(this),
            new Pinch().$injectRoot(this),
            new Pan().$injectRoot(this),
            new Swipe().$injectRoot(this),
            new Tap().$injectRoot(this),
            new Press().$injectRoot(this),
        ];
        // 应用设置
        this.update();
        // 绑定事件
        this.unbind = this._bindRecognizers(this.el).unbind;
    };


    /**
     * 计算touch-action
     * @param {HTMLElement} 目标元素 
     */
    private _updateTouchAction() {
        if ('compute' === this.options.touchAction) {
            let touchActions = [];
            for (let recognizer of this.recognizers) {
                touchActions.push(...recognizer.getTouchAction());
            };
            this.el.style.touchAction = computeTouchAction(touchActions);
        } else {
            this.el.style.touchAction = this.options.touchAction || 'auto';
        }
    };

    /**
     * 应用几个提高体验的样式
     * 如: 禁止选择文字/透明点击高亮颜色等
     */
    private _updateStyle() {
        for (let key in this.options.style) {
            let value = this.options.style[key];
            (this.el.style as any)[key] = value;
        }
    };

    /**
     * 更新设置
     */
    public update() {
        this._updateStyle();
        this._updateTouchAction();
    };

    /**
     * 绑定手势到指定元素
     * 暂时只支持事件冒泡阶段触发, 
     * 改为捕获阶段需要对inputListener进行编号, 
     * 产生大量事件绑定,
     * 而非在一次触发事件中执行所有手势判断
     * @param {Element} 待绑定手势元素
     */
    private _bindRecognizers(el: Element) {
        const boundInputListener = this.inputListener.bind(this);
        // Touch
        if ('touch' === this.inputType) {
            const events = ['touchstart', 'touchmove', 'touchend', 'touchcancel'];
            events.forEach(eventName => {
                el.addEventListener(eventName, boundInputListener);
            });
            return {
                unbind: () => {
                    events.forEach(eventName => {
                        el.removeEventListener(eventName, boundInputListener);
                    });
                }
            }


        }
        // Mouse
        else {
            el.addEventListener('mousedown', boundInputListener);
            window.addEventListener('mousemove', boundInputListener);
            window.addEventListener('mouseup', boundInputListener);
            return {
                unbind: () => {
                    el.removeEventListener('mousedown', boundInputListener);
                    window.removeEventListener('mousemove', boundInputListener);
                    window.removeEventListener('mouseup', boundInputListener);
                }
            };
        }
    };

    /**
     * 添加识别器
     * @param recognizer 识别器
     */
    add(recognizer: any): void {
        recognizer.$injectRoot(this);
        const hasSameName = this.recognizers.some((theRecognizer: any) => recognizer.name === theRecognizer.name);
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
     * @return {Recognizer} 返回识别器
     */
    get(name: string): any {
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

    /**
     * 监听input变化
     * @param {Event}
     */
    inputListener(event: Event): void {
        if (this.options.isPreventDefault) {
            event.preventDefault();
        }

        if (!event.cancelable) {
            this.eventEmitter.emit('error', { code: 0, message: '页面滚动的时候, 请暂时不要操作元素!' });
        }

        // 管理历史input

        // let inputs = inputManage(event);
        let inputs = this.inputManage.load(event);
        // 当是鼠标事件的时候, mouseup阶段的input为undefined
        if (undefined !== inputs) {
            // console.warn(inputs.startInput);

            const computed = compute(inputs);
            // 重置停止标记
            if (computed.isFirst) {
                this._isStopped = false;
            }
            // input事件
            this.emit('input', computed);
            if (computed.isFirst) {
                this.emit('inputstart', computed);
            } else if (computed.isFinal) {
                if ('cancel' === computed.eventType) {
                    this.emit('inputcancel', computed);
                } else {
                    this.emit('inputend', computed);
                }
            } else {
                if (inputs.prevInput.pointLength > inputs.input.pointLength) {
                    this.emit('inputreduce', computed);
                } else if (inputs.prevInput.pointLength < inputs.input.pointLength) {

                    this.emit('inputadd', computed);
                } else {
                    this.emit('inputmove', computed);
                }
            };


            for (let recognizer of this.recognizers) {
                if (recognizer.disabled) continue;
                // 如果遇到停止标记, 立即停止运行后面的识别器
                recognizer.recognize(computed);
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
    on(type: string, listener: (event: Computed) => void, options: { [k: string]: boolean } | boolean = false): void {
        this.eventEmitter.on(type, listener);
    };

    /**
     * 解绑事件
     * @param {String} 事件名 
     * @param {Function} 事件回调
     */
    off(type: string, listener?: (event: Computed) => void): void {
        this.eventEmitter.off(type, listener);
    };

    /**
     * 触发事件, 同时type会作为payload的一个键值
     * @param {String} 类型名
     * @param {Object} 数据
     */
    emit(type: string, payload: any) {
        payload.type = type;
        this.eventEmitter.emit(type, payload);
    };

    /**
     * 解绑所有触摸事件
     */
    public unbind(): void { };

    /**
     * 销毁
     */
    destroy() {
        // 解绑事件
        this.unbind();
        this.eventEmitter.destroy();
    };
};