import { Computed } from '../interface';

import Recognizer from './Base';
export default class PressRecognizer extends Recognizer {
    protected _timeoutId: number;
    constructor(options: any) {
        super(options);
        this._timeoutId = null;
    };

    /**
     * 识别条件
     * @param {Computed} 计算数据
     * @param {(isRecognized: boolean) => void}} 接收是否识别状态
     */
    public test(computed: Computed, callback: (isRecognized: boolean) => void): void {
        const { inputStatus, distance, duration, maxPointerLength } = computed;
        if (1 < maxPointerLength) {
            this.cancel();
            callback(false);
        } else {
            if ('start' === inputStatus) {
                this._timeoutId = window.setTimeout(() => {
                    callback(true);
                }, 250);
            } else if ('move' === inputStatus) {
                if (9 < distance) {
                    this.cancel();
                    callback(false);
                }
            } else if ('end' === inputStatus) {
                if (251 > duration || 9 < distance) {
                    this.cancel();
                    callback(false);
                } else {
                    this.afterRecognized(computed);
                }
            } else if ('cancel' === inputStatus) {
                this.afterRecognized(computed);
            }
        }
    };

    /**
     * 识别后执行
     * @param {Computed} 计算数据 
     */
    public afterRecognized(computed: Computed) {
        this.emit('pressup', computed);
    };

    protected cancel() {
        clearTimeout(this._timeoutId);
    }
};