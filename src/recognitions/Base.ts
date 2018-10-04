import { nativeEventType } from '../interface';

export default class Recognizer {
    private _isRecognized: boolean;

    constructor() {
        this._isRecognized = false;
    };

    /**
     * 识别手势事件的状态
     * 手势的状态, 非原生事件的状态
     * @param {nativeEventType} 输入状态 
     */
    public recognizenativeEventType(nativeEventType: nativeEventType) {
        
        if (this._isRecognized) {
            if ('move' === nativeEventType) {
                return 'move';
            } else {
                this._isRecognized = false;
                return 'end';
            }
        } else {
            this._isRecognized = true;
            return 'start';
        }
    }
};