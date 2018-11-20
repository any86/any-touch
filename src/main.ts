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
    DIRECTION_NONE,
    DIRECTION_LEFT,
    DIRECTION_RIGHT,
    DIRECTION_UP,
    DIRECTION_DOWN,
    DIRECTION_HORIZONTAL,
    DIRECTION_VERTICAL,
    DIRECTION_ALL
} from './const';
import EventBus from './EventBus';
import inputManage from './inputManage';
import compute from './compute/index';

import TapRecognizer from './recognitions/Tap';
import PressRecognizer from './recognitions/Press';
import PanRecognizer from './recognitions/Pan';
import SwipeRecognizer from './recognitions/Swipe';
import PinchRecognizer from './recognitions/Pinch';
import RotateRecognizer from './recognitions/Rotate';

export default class AnyTouch {
    static TapRecognizer = TapRecognizer;
    static PressRecognizer = PressRecognizer;
    static PanRecognizer = PanRecognizer;
    static SwipeRecognizer = SwipeRecognizer;
    static PinchRecognizer = PinchRecognizer;
    static RotateRecognizer = RotateRecognizer;
    static DIRECTION_NONE = DIRECTION_NONE;
    static DIRECTION_UP = DIRECTION_UP;
    static DIRECTION_RIGHT = DIRECTION_RIGHT;
    static DIRECTION_DOWN = DIRECTION_DOWN;
    static DIRECTION_LEFT = DIRECTION_LEFT;
    static DIRECTION_HORIZONTAL = DIRECTION_LEFT | DIRECTION_RIGHT;
    static DIRECTION_VERTICAL = DIRECTION_UP | DIRECTION_DOWN;
    static DIRECTION_ALL = DIRECTION_HORIZONTAL | DIRECTION_VERTICAL;

    // 目标元素
    $el: Element;

    // 各个手势对应的handle集合
    eventBus: any;

    recognizers: { [propName: string]: any, name: string }[];

    unbinders: any[];

    version: string;

    isMobile: boolean;

    /**
     * @param {Element} el
     * @param {Object} param1
     */
    constructor(el: HTMLElement, {
    } = {}) {
        this.version = '0.0.2';
        this.isMobile = IS_MOBILE;
        this.eventBus = new EventBus(el);
        this.recognizers = [
            new TapRecognizer({ name: 'tap', pointer: 1, taps: 1 }),
            new PressRecognizer({ name: 'press' }),
            new PanRecognizer({ name: 'pan' }),
            new SwipeRecognizer({ name: 'swipe' }),
            new PinchRecognizer({ name: 'pinch' }),
            new RotateRecognizer({ name: 'rotate' }),
        ];

        this.recognizers.forEach(recognizer => {
            el.style.touchAction = recognizer.getTouchAction();
        });

        // 绑定事件
        this.unbinders = this._bindRecognizers(el);
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

    set({
        touchAction = 'compute',
        enable = true,
        domEvents = false
    } = {}) {

    };

    /**
     * 删除识别器
     * @param {String} 识别器name
     */
    remove(recognizerName: string) {
        for (let [index, recognizer] of this.recognizers.entries()) {
            if (recognizerName === recognizer.name) {
                this.recognizers.splice(index, 1);
            }
        }
    };

    handler(event: TouchEvent) {
        // event.preventDefault();
        // 记录各个阶段的input
        let inputs = inputManage(event);
        if (undefined !== inputs) {
            const computed: Computed = compute(inputs);
            // 当是鼠标事件的时候, mouseup阶段的input和computed为空
            this.recognizers.forEach(recognizer => {
                // 注入emit到recognizer中
                recognizer.injectEmit(this.eventBus.emit.bind(this.eventBus));
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

    headUpperCase(str: string) {
        return str.toLowerCase().replace(/( |^)[a-z]/g, (L) => L.toUpperCase());
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