/*
* 未知 => 识别成功 => 已知(开始|结束) => 已知(移动变化中) => 已知(结束)
* 未知 => 识别失败 
* 未知 => 取消(已知的任意阶段)
* */
import { nativeEventType } from '../interface';
export default class Recognizer {
    public isRecognized: boolean;
    constructor() {
        this.isRecognized = false;
    };

    /**
     * 识别手势事件的状态
     * 手势的状态, 非原生事件的状态
     * @param {nativeEventType} 输入状态 
     */
    public recognizeType(nativeEventType: nativeEventType) {

        if (this.isRecognized) {
            if ('move' === nativeEventType) {
                return 'move';
            } else {
                this.isRecognized = false;
                return 'end';
            }
        } else {
            this.isRecognized = true;
            return 'start';
        }
    }
};