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


import { EventHandler } from './interface';
import { SUPPORT_ONLY_TOUCH } from './const';
import EventBus from './EventBus';
import {
    getVLength,
} from './vector'
import compute from './compute/index';
import TapRecognizer from './recognitions/Tap';
import PressRecognizer from './recognitions/Press';
import PanRecognizer from './recognitions/Pan';
import SwipeRecognizer from './recognitions/Swipe';
import PinchRecognizer from './recognitions/Pinch';
import RotateRecognizer from './recognitions/Rotate';

// create and dispatch the event





export default class AnyTouch {
    static TapRecognizer = TapRecognizer;
    static PressRecognizer = PressRecognizer;
    static PanRecognizer = PanRecognizer;
    static SwipeRecognizer = SwipeRecognizer;
    static PinchRecognizer = PinchRecognizer;
    static RotateRecognizer = RotateRecognizer;

    // 目标元素
    $el: Element;
    // 是否阻止默认事件
    isPreventDefault: Boolean;
    // 是否阻止冒泡
    isStopPropagation: Boolean;

    // 各个手势对应的handle集合
    eventBus: any;

    recognizers: any[];

    unbinders: any[];

    /**
     * @param {Element} el
     * @param {Object} param1
     */
    constructor(el: Element, {
        isPreventDefault = false,
        isStopPropagation = false,
        hasDoubleTap = true
    } = {}) {
        this.$el = el;
        this.eventBus = new EventBus(el);
        this.recognizers = [
            new TapRecognizer({ hasDoubleTap }),
            new PressRecognizer(),
            new PanRecognizer(),
            new SwipeRecognizer(),
            new PinchRecognizer(),
            new RotateRecognizer(),
        ];
        // 绑定事件
        if (SUPPORT_ONLY_TOUCH) {
            this.unbinders = ['touchstart', 'touchmove', 'touchend', 'touchcancel'].map(eventName => {
                let boundFn = this.handler.bind(this);
                this.$el.addEventListener(eventName, boundFn);
                return () => {
                    this.$el.removeEventListener(eventName, boundFn);
                }
            });
        } else {
            let boundFn = this.handler.bind(this);
            this.$el.addEventListener('mousedown', boundFn);
            window.addEventListener('mousemove', boundFn);
            window.addEventListener('mouseup', boundFn);
        }
    }

    setConfig({
        isPreventDefault = false,
        isStopPropagation = false
    } = {}) {
        this.isPreventDefault = isPreventDefault;
        this.isStopPropagation = isStopPropagation;
    };

    handler(event: TouchEvent) {
        event.preventDefault();
        // computed为包含了计算值的input
        const computed = compute(event);
        // console.log(computed);
        // 当是鼠标事件的时候, mouseup阶段的input和computed为空
        if (undefined !== computed) {
            this.recognizers.forEach(recognizer => {
                recognizer.recognize(computed, (data: any) => {
                    this.eventBus.emit(data.type, data);
                });
            });
        }
    };

    on(eventName: string, callback: EventHandler, preset: object): void {
        this.eventBus.on(eventName, callback);
    };

    headUpperCase(str: string) {
        return str.toLowerCase().replace(/( |^)[a-z]/g, (L) => L.toUpperCase());
    }
}