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
import EventBus from './EventBus';
import inputManage from './inputManage';
import compute from './compute/index';
import computeTouchAction from './untils/computeTouchAction'

import TapRecognizer from './recognitions/Tap';
import PressRecognizer from './recognitions/Press';
import PanRecognizer from './recognitions/Pan';
import SwipeRecognizer from './recognitions/Swipe';
import PinchRecognizer from './recognitions/Pinch';
import RotateRecognizer from './recognitions/Rotate';
interface Options {
    touchAction?: 'compute' | 'auto' | 'manipulation' | 'pan-x' | 'pan-y' | 'none';
    domEvents?: boolean;
};
const DEFAULT_OPTIONS: Options = {
    touchAction: 'compute',
    domEvents: true
};
export default class AnyTouch {
    static TapRecognizer = TapRecognizer;
    static PressRecognizer = PressRecognizer;
    static PanRecognizer = PanRecognizer;
    static SwipeRecognizer = SwipeRecognizer;
    static PinchRecognizer = PinchRecognizer;
    static RotateRecognizer = RotateRecognizer;

    // 目标元素
    el: HTMLElement;

    // 各个手势对应的handle集合
    eventBus: any;

    recognizers: { [propName: string]: any, name: string }[];

    unbinders: any[];

    version: string;

    isMobile: boolean;

    options: Options;
    /**
     * @param {Element} el
     * @param {Object} param1
     */
    constructor(el: HTMLElement, options: Options = DEFAULT_OPTIONS) {
        this.version = '0.0.2';
        this.el = el;
        this.isMobile = IS_MOBILE;
        this.eventBus = new EventBus(el);
        this.options = { ...DEFAULT_OPTIONS, ...options };
        this.recognizers = [
            new TapRecognizer(),
            new PressRecognizer(),
            new PanRecognizer(),
            new SwipeRecognizer(),
            new PinchRecognizer(),
            new RotateRecognizer(),
        ];
        this.recognizers.forEach(recognizer => {
            recognizer.injectUpdate(this._update.bind(this));
        });
        // 计算touch-action
        this.setTouchAction(el);
    };

    /**
     * 计算touch-action
     * @param {HTMLElement} 目标元素 
     */
    public setTouchAction(el: HTMLElement) {
        if ('compute' === this.options.touchAction) {
            let touchActions = [];
            for (let recognizer of this.recognizers) {
                touchActions.push(...recognizer.getTouchAction());
            };
            el.style.touchAction = computeTouchAction(touchActions);

            // 绑定事件
            this.unbinders = this._bindRecognizers(el);
        } else {
            el.style.touchAction = this.options.touchAction;
        }
    };

    private _update() {
        this.setTouchAction(this.el);
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
    add(recognizer: any) {
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

    set(options: Options = DEFAULT_OPTIONS) {
        this.options = { ...DEFAULT_OPTIONS, ...options };
        this._update();
    };

    /**
     * 删除识别器
     * @param {String} 识别器name
     */
    remove(recognizerName: string) {
        for (let [index, recognizer] of this.recognizers.entries()) {
            if (recognizerName === recognizer.options.name) {
                this.recognizers.splice(index, 1);
                break;
            }
        }
    };

    public handler(event: TouchEvent) {
        // event.preventDefault();
        // 记录各个阶段的input
        let inputs = inputManage(event);
        if (undefined !== inputs) {
            const computed: Computed = compute(inputs);
            // 当是鼠标事件的时候, mouseup阶段的input和computed为空
            this.recognizers.forEach(recognizer => {
                // 注入emit到recognizer中
                recognizer.injectEmit(this.eventBus.emit.bind(this.eventBus));
                // 构造原生event
                recognizer.afterEmit((type: string, payload: {[propName:string]:any}) => {
                    if (this.options.domEvents) {
                        let event:any = new Event(type, {});
                        event.computed = payload;
                        this.el.dispatchEvent(event);
                    }
                });
                recognizer.recognize(computed);
                this.eventBus.emit('input', { ...computed, type: 'input' });
            });
        }
    };

    /**
     * 注册事件
     * @param {String} 事件名
     * @param {Function} 回调函数
     */
    on(eventName: string, callback: EventHandler): any {
        this.eventBus.on(eventName, callback);
    };

    /**
     * 解绑事件
     * @param {String} 事件名 
     * @param {Function} 事件回调
     */
    off(eventName: string, handler: any = undefined): void {
        this.eventBus.off(eventName, handler);
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
}