/**
 * ==================== 参考 ====================
 * https://segmentfault.com/a/1190000010511484#articleHeader0
 * https://segmentfault.com/a/1190000007448808#articleHeader1
 * hammer.js
 * 
 * ==================== 支持的手势 ====================
 * rotate 旋转
 * pinch : Function,
 * tap 单机
 * doubleTap 双击
 * press 按压
 * pan 拖拽
 * swipe 快速划过
 * 
 * ==================== 流程 ====================
 * 格式化Event成统一的pointer格式 => 通过pointer数据计算 => 用计算结果去识别手势
 */
import AnyEvent from 'any-event';
import { Computed } from './interface';
import {
    SUPPORT_ONLY_TOUCH, SUPPORT_TOUCH,
    IS_MOBILE,
} from './const';
import inputManage from './inputManage';
import compute from './compute/index';
import computeTouchAction from './untils/computeTouchAction'
// 识别器
import TapRecognizer from './recognitions/Tap';
import PressRecognizer from './recognitions/Press';
import PanRecognizer from './recognitions/Pan';
import SwipeRecognizer from './recognitions/Swipe';
import PinchRecognizer from './recognitions/Pinch';
import RotateRecognizer from './recognitions/Rotate';
import * as Vector from './vector';
interface Options {
    touchAction?: 'compute' | 'auto' | 'manipulation' | 'pan-x' | 'pan-y' | 'none';
    hasDomEvents?: boolean;
    isPreventDefault?: boolean;
};
export default class AnyTouch {
    // 识别器
    static TapRecognizer = TapRecognizer;
    static PressRecognizer = PressRecognizer;
    static PanRecognizer = PanRecognizer;
    static SwipeRecognizer = SwipeRecognizer;
    static PinchRecognizer = PinchRecognizer;
    static RotateRecognizer = RotateRecognizer;

    // 缩写
    static Tap = TapRecognizer;
    static Press = PressRecognizer;
    static Pan = PanRecognizer;
    static Swipe = SwipeRecognizer;
    static Pinch = PinchRecognizer;
    static Rotate = RotateRecognizer;

    // 向量计算
    static Vector = Vector;

    // mini的事件触发器
    static EventEmitter = AnyEvent;

    // 目标元素
    el: HTMLElement;

    default: Options;

    inputType: string;

    recognizers: { [propName: string]: any, name: string }[];

    unbinders: any[];

    options: Options;

    version: string;

    eventBus: any;

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
            isPreventDefault: false
        };
        this.el = el;
        this.inputType = SUPPORT_TOUCH ? 'touch' : 'mouse';
        this.options = { ...this.default, ...options };
        // eventBus
        this.eventBus = new AnyEvent();
        this._isStopped = false;
        // 识别器
        this.recognizers = [
            new RotateRecognizer().$injectRoot(this),
            new PinchRecognizer().$injectRoot(this),
            new PanRecognizer().$injectRoot(this),
            new SwipeRecognizer().$injectRoot(this),
            new TapRecognizer().$injectRoot(this),
            new PressRecognizer().$injectRoot(this),
        ];
        // 应用设置
        // this.update();

        // 绑定事件
        this.unbinders = this._bindRecognizers(this.el);
    };

    /**
     * 计算touch-action
     * @param {HTMLElement} 目标元素 
     */
    public updateTouchAction(el: HTMLElement) {
        if ('compute' === this.options.touchAction) {
            let touchActions = [];
            for (let recognizer of this.recognizers) {
                // console.log(recognizer.options);
                touchActions.push(...recognizer.getTouchAction());
            };
            el.style.touchAction = computeTouchAction(touchActions);
        } else {
            el.style.touchAction = this.options.touchAction || 'auto';
        }
    };

    public update() {
        this.updateTouchAction(this.el);
    };

    /**
     * 绑定手势到指定元素
     * @param {Element} 待绑定手势元素
     */
    private _bindRecognizers(el: Element) {
        const boundFn = this.inputListener.bind(this);
        if ('touch' === this.inputType) {
            return ['touchstart', 'touchmove', 'touchend', 'touchcancel'].map(eventName => {
                el.addEventListener(eventName, boundFn, { passive: false });
                return () => {
                    el.removeEventListener(eventName, boundFn);
                }
            });
        } else {
            el.addEventListener('mousedown', boundFn);
            window.addEventListener('mousemove', boundFn);
            window.addEventListener('mouseup', boundFn);
            return [
                () => {
                    el.removeEventListener('mousedown', boundFn);
                },
                () => {
                    window.removeEventListener('mousemove', boundFn);
                },
                () => {
                    window.removeEventListener('mouseup', boundFn);
                }
            ]
        }
    };

    /**
     * 添加识别器
     * @param recognizer 识别器
     */
    add(recognizer: any): void {
        recognizer.$injectRoot(this);
        this.recognizers.push(recognizer);
        this.update();
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
        if (!event.cancelable) {
            this.eventBus.emit('error', { code: 0, message: '页面滚动的时候, 请暂时不要操作元素!' });
        }

        if (this.options.isPreventDefault) {
            event.preventDefault();
        }

        // 记录各个阶段的input
        let inputs = inputManage(event);
        if (undefined !== inputs) {
            const computed = compute(inputs);
            if ((<Computed>computed).isFirst) {
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
                if (inputs.prevInput.pointerLength > inputs.input.pointerLength) {
                    this.emit('inputreduce', computed);
                } else if (inputs.prevInput.pointerLength < inputs.input.pointerLength) {

                    this.emit('inputadd', computed);
                } else {
                    this.emit('inputmove', computed);
                }
            };

            // 当是鼠标事件的时候, mouseup阶段的input和computed为空
            for (let recognizer of this.recognizers) {
                if (recognizer.disabled) continue;
                if (this._isStopped) {
                    break;
                }
                recognizer.recognize(computed);
            }
        }
    };

    /**
     * 注册事件
     * @param {String} 事件名
     * @param {Function} 回调函数
     */
    on(type: string, listener: (event: Computed) => void): void {
        this.eventBus.on(type, listener);
    };

    /**
     * 解绑事件
     * @param {String} 事件名 
     * @param {Function} 事件回调
     */
    off(type: string, listener?: (event: Computed) => void): void {
        this.eventBus.off(type, listener);
    };

    /**
     * 触发事件, 同时type会作为payload的一个键值
     * @param {String} 类型名
     * @param {Object} 数据
     */
    emit(type: string, payload: any) {
        payload.type = type;
        this.eventBus.emit(type, payload);
    };

    /**
     * 销毁
     */
    destroy() {
        // 解绑事件
        this.unbinders.forEach(unbinder => {
            unbinder();
        });
    };
};