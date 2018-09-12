/**
 * https://segmentfault.com/a/1190000010511484#articleHeader0
 * https://segmentfault.com/a/1190000007448808#articleHeader1
 * rotate 旋转
 * pinch : Function,
 * tap 单机
 * doubleTap 双击
 * press 按压
 * pan 拖拽
 * swipe 快速划过
 */

import { HandlerBus, AnyTouchHandler } from './interface';
import EventBus from './EventBus';
import session from './session';
import {
    getVLength,
} from './vector'
import normalize from './input';
import TapRecognizer from './recognitions/Tap';
import PressRecognizer from './recognitions/Press';
import PanRecognizer from './recognitions/Pan';
import SwipeRecognizer from './recognitions/Swipe';
import PinchRecognizer from './recognitions/Pinch';
import RotateRecognizer from './recognitions/Rotate';
export default class AnyTouch {
    // 目标元素
    $el: Element;
    // 是否阻止默认事件
    isPreventDefault: Boolean;
    // 是否阻止冒泡
    isStopPropagation: Boolean;

    // 各个手势对应的handle集合
    handlerBus: HandlerBus;

    recognizers: any[];

    unbinders: any[];

    /**
     * @param {Element} el
     * @param {Object} param1
     */
    constructor(el: Element, {
        isPreventDefault = false,
        isStopPropagation = false
    } = {}) {
        this.$el = el;
        this.handlerBus = {};
        session.eventBus = new EventBus();
        this.recognizers = [
            new TapRecognizer(),
            new PressRecognizer(),
            new PanRecognizer(),
            new SwipeRecognizer(),
            new PinchRecognizer(),
            new RotateRecognizer(),
        ];
        // 绑定事件
        // ['mouseup', 'mousemove','mousedown'];
        this.unbinders = ['touchstart', 'touchmove', 'touchend', 'touchcancel'].map(eventName => {
            let boundFn = this.handler.bind(this);
            this.$el.addEventListener(eventName, boundFn);
            return () => {
                this.$el.removeEventListener(eventName, boundFn);
            }
        });
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
        const input = normalize(event);
        this.recognizers.forEach(recognizer => {
            recognizer.recognize(input);
        });
    };

    on(eventName: string, callback: AnyTouchHandler, preset: object): void {
        session.eventBus.on(eventName, callback);
    };


    headUpperCase(str: string) {
        return str.toLowerCase().replace(/( |^)[a-z]/g, (L) => L.toUpperCase());
    }
}