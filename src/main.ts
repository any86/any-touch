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
import { SUPPORT_ONLY_TOUCH, IS_MOBILE } from './const';
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

    // 目标元素
    $el: Element;

    // 各个手势对应的handle集合
    eventBus: any;

    recognizers: any[];

    unbinders: any[];

    version: string;

    isMobile: boolean;

    /**
     * @param {Element} el
     * @param {Object} param1
     */
    constructor(el: Element, {
    } = {}) {
        this.version = '0.0.2';
        this.isMobile = IS_MOBILE;
        this.$el = el;
        this.eventBus = new EventBus(el);
        this.recognizers = [
            new TapRecognizer({ name: 'tap', pointer: 1, taps: 1 }),
            new PressRecognizer({name:'press'}),
            new PanRecognizer({name:'pan'}),
            new SwipeRecognizer({name:'swipe'}),
            new PinchRecognizer({name:'pinch'}),
            new RotateRecognizer({name:'rotate'}),
        ];

        // 绑定事件
        if (this.isMobile) {
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
            this.unbinders = [
                () => {
                    this.$el.removeEventListener('mousedown', boundFn);
                },
                () => {
                    window.removeEventListener('mousemove', boundFn);
                },
                () => {
                    window.removeEventListener('mouseup', boundFn);
                }
            ]
        }
    }

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
        // console.log(this.recognizers);
        // this.recognizers.forEach(item => {
        //     console.log(item);
        // });
        return this.recognizers.find(recognizer=>name === recognizer.name);
    };

    set({
    } = {}) {
    };

    handler(event: TouchEvent) {
        // event.preventDefault();
        // 记录各个阶段的input
        let inputs = inputManage(event);
        const computed: Computed = compute(inputs);





        // 当是鼠标事件的时候, mouseup阶段的input和computed为空
        if (undefined !== computed) {
            this.recognizers.forEach(recognizer => {
                recognizer.recognize(computed, (data: Computed) => {
                    this.eventBus.dispatch(data.type, data);
                });
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
    off(eventName: string, callback: EventHandler): void {
        this.eventBus.off(eventName, callback);
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