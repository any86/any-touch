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
 * touchStart
 * touchMove
 * touchEnd
 */

import {EventHandler} from './interface';
import {
    getVLength,
} from './vector'
import input from './input';
import compute from './compute';

export default class AnyTouch {
    // 目标元素
    el: Element;
    // 是否阻止默认事件
    isPreventDefault: Boolean;
    // 是否阻止冒泡
    isStopPropagation: Boolean;

    // 各个手势对应的handle集合
    handleMap: EventHandler;

    /**
     * @param {Element} el
     * @param {Object} param1
     */
    constructor(el: Element, {
        isPreventDefault = false,
        isStopPropagation = false
    } = {}) {
        // 绑定事件
        el.addEventListener('touchstart', this.handler);
        el.addEventListener('touchmove', this.handler);
        el.addEventListener('touchend', this.handler);
        el.addEventListener('touchcancel', this.handler);
    }

    setConfig({
        isPreventDefault = false,
        isStopPropagation = false
    } = {}) {
        this.isPreventDefault = isPreventDefault;
        this.isStopPropagation = isStopPropagation;
    };

    handler(event:TouchEvent){
        event.preventDefault();
        let data = input(event);
        let data2 = compute(data);
        event.target.textContent = JSON.stringify(data2, null, 4);
    }
    /**
     * "-"格式转成驼峰格式
     * @param {String} string 
     */
    camelize(string:string):string {
        var camelizeRE = /-(\w)/g;
        return string.replace(camelizeRE, word => {
            return word.toLocaleUpperCase().slice(1)
        });
    }
}