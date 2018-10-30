import { IS_MOBILE } from './const';
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
    constructor(el, {} = {}) {
        this.version = '0.0.2';
        this.isMobile = IS_MOBILE;
        this.$el = el;
        this.eventBus = new EventBus(el);
        this.recognizers = [
            new TapRecognizer({ name: 'tap', pointer: 1, taps: 1 }),
            new PressRecognizer({ name: 'press' }),
            new PanRecognizer({ name: 'pan' }),
            new SwipeRecognizer({ name: 'swipe' }),
            new PinchRecognizer({ name: 'pinch' }),
            new RotateRecognizer({ name: 'rotate' }),
        ];
        if (this.isMobile) {
            this.unbinders = ['touchstart', 'touchmove', 'touchend', 'touchcancel'].map(eventName => {
                let boundFn = this.handler.bind(this);
                this.$el.addEventListener(eventName, boundFn);
                return () => {
                    this.$el.removeEventListener(eventName, boundFn);
                };
            });
        }
        else {
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
            ];
        }
    }
    add(recognizer) {
        this.recognizers.push(recognizer);
    }
    ;
    get(name) {
        return this.recognizers.find(recognizer => name === recognizer.name);
    }
    ;
    set({} = {}) {
    }
    ;
    handler(event) {
        let inputs = inputManage(event);
        if (undefined !== inputs) {
            const computed = compute(inputs);
            this.recognizers.forEach(recognizer => {
                recognizer.recognize(computed, (data) => {
                    this.eventBus.dispatch(data.type, data);
                });
            });
        }
    }
    ;
    on(eventName, callback) {
        this.eventBus.on(eventName, callback);
    }
    ;
    off(eventName, callback) {
        this.eventBus.off(eventName, callback);
    }
    ;
    headUpperCase(str) {
        return str.toLowerCase().replace(/( |^)[a-z]/g, (L) => L.toUpperCase());
    }
    ;
    destroy() {
        this.unbinders.forEach(unbinder => {
            unbinder();
        });
    }
    ;
}
AnyTouch.TapRecognizer = TapRecognizer;
AnyTouch.PressRecognizer = PressRecognizer;
AnyTouch.PanRecognizer = PanRecognizer;
AnyTouch.SwipeRecognizer = SwipeRecognizer;
AnyTouch.PinchRecognizer = PinchRecognizer;
AnyTouch.RotateRecognizer = RotateRecognizer;
