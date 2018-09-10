/**
 * 构造统一的touchEvent格式
 */
export default class AnyTouchEvent {
    public pointers: any|TouchList;
    public length: number;
    public timestamp: number;
    public target: EventTarget;
    /**
     * @param {TouchList}  
     */
    constructor(pointers: any|TouchList) {
        this.pointers = pointers;
        this.length = length;
        this.timestamp = Date.now();
        this.target = event.target;
    }
}