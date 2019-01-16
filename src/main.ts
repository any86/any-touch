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
import { EventHandler, Computed } from './interface';
import {
    SUPPORT_ONLY_TOUCH,
    IS_MOBILE,
} from './const';
import inputManage from './inputManage';
import compute from './compute/index';
import computeTouchAction from './untils/computeTouchAction'
// 识别器
import Recognizer from './recognitions/Base';
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
    static TapRecognizer = TapRecognizer;
    static PressRecognizer = PressRecognizer;
    static PanRecognizer = PanRecognizer;
    static SwipeRecognizer = SwipeRecognizer;
    static PinchRecognizer = PinchRecognizer;
    static RotateRecognizer = RotateRecognizer;
    static Vector = Vector;
    // 目标元素
    el: HTMLElement;

    default: Options;

    recognizers: { [propName: string]: any, name: string }[];

    unbinders: any[];

    version: string;

    isMobile: boolean;

    options: Options;

    /**
     * @param {Element} el
     * @param {Object} param1
     */
    constructor(el: HTMLElement, options?: Options) {
        this.version = '0.0.12';
        this.el = el;
        this.isMobile = IS_MOBILE;
        this.options = { ...this.default, ...options };
        this.recognizers = [
            new TapRecognizer(),
            new PressRecognizer(),
            new PanRecognizer(),
            new SwipeRecognizer(),
            new PinchRecognizer(),
            new RotateRecognizer(),
        ];
        // 注入el到识别器原型
        // 后面模拟浏览器时间需要用到el
        Recognizer.prototype.el = el;
        Recognizer.prototype.hasDomEvents = this.options.hasDomEvents;
        // 识别器注入update方法
        Recognizer.$inject('update', this.update.bind(this));

        // 应用设置
        this.update();

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
                touchActions.push(...recognizer.getTouchAction());
            };
            el.style.touchAction = computeTouchAction(touchActions);
        } else {
            el.style.touchAction = this.options.touchAction;
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
        const boundFn = this.handler.bind(this);
        if (this.isMobile) {
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
        this.recognizers.push(recognizer);
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

    handler(event: TouchEvent | MouseEvent): void {
        if (!event.cancelable) {
            Recognizer.prototype.emit('error', { code: 0, message: '页面滚动的时候, 请暂时不要操作元素!' });
        }

        if (this.options.isPreventDefault) {
            event.preventDefault();
        }
        // 记录各个阶段的input
        let inputs = inputManage(event);
        if (undefined !== inputs) {
            const computed: Computed = compute(inputs);
            // 当是鼠标事件的时候, mouseup阶段的input和computed为空
            for(let recognizer of this.recognizers) {
                const isValidEvent = Recognizer.prototype.eventBus.has(recognizer.name);
                if(!isValidEvent) continue;
                recognizer.recognize(computed);
                // recognizer.emit('input', { ...computed, type: 'input' });
            }
        }
    };

    /**
     * 注册事件
     * @param {String} 事件名
     * @param {Function} 回调函数
     */
    on(type: string, listener: EventHandler): void {
        Recognizer.prototype.on(type, listener);
    };

    /**
     * 解绑事件
     * @param {String} 事件名 
     * @param {Function} 事件回调
     */
    off(type: string, listener?: EventHandler): void {
        Recognizer.prototype.off(type, listener);
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

AnyTouch.prototype.default = {
    touchAction: 'compute',
    hasDomEvents: true,
    isPreventDefault: true
};