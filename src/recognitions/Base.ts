/*
* 未知 => 识别成功 => 已知(开始|结束) => 已知(移动变化中) => 已知(结束)
* 未知 => 识别失败 
* 未知 => 取消(已知的任意阶段)
* */
import { nativeEventType } from '../interface';
export default class Recognizer {
    public status: string;
    public isRecognized: boolean;
    public options: any;
    private _requireFailureList:any[];
    constructor() {
        this.status = 'unknown';
        this.isRecognized = false;
        this._requireFailureList = [];
    };

    /**
     * 前者需要后者失败才能触发
     * @param 识别器实例 
     */
    public requireFailure(recognizerInstance:any){
        const {name} = this.options;
        this._requireFailureList.push({name, requireFailureName: recognizerInstance.options.name})
    };

    public hasRequireFailure(){
        // this._requireFailureList.find()
        // return this.
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
    };
};