import RecognizerWithRequireFailure from './RecognizerWithRequireFailure';
import {NONE} from '@const';
import { AnyTouchEvent, InputRecord } from '@types';
import computMulti from '@compute/computeMulti';
import recognizeForPressMoveLike from './recognizeForPressMoveLike';

export default class RotateRecognizer extends RecognizerWithRequireFailure {
    static DEFAULT_OPTIONS = {
        name: 'rotate',
        // 触发事件所需要的最小角度
        threshold: 0,
        pointLength: 2,
    };
    constructor(options = {}) {
        super(options);
    };

    getTouchAction() {
        return [NONE];
    };

    /**
     * 无特殊事件要触发
     */
    afterEmit():void { };

    /**
     * 识别条件
     * @param {AnyTouchEvent} 计算数据
     * @return {Boolean} 接收是否识别状态
     */
    test(inputRecord:InputRecord): boolean {
        const {input} = inputRecord;
        const {pointLength} = input;
   
        const {angle,deltaAngle} = this._getComputed(computMulti,inputRecord,<any>this.$store)
        this.event = {...this.event, angle,deltaAngle};
        // 如果触碰点数要大于指定
        // 如果缩放超过阈值, 或者已识别
        return this.isValidPointLength(pointLength) && (this.options.threshold < Math.abs(angle) || this.isRecognized);
    };

        /**
     * 开始识别
     * @param {InputRecord} 输入 
     */
    recognize(inputRecord:InputRecord){
        recognizeForPressMoveLike(this,inputRecord);
    };
};