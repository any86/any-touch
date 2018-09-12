/**
 * 构造统一的touchEvent格式
 */
import { propX, propY } from './const';
import { getCenter } from './vector'
export default class AnyInput {
    public pointers: any | TouchList;
    public timestamp: number;
    public target: EventTarget;
    public center: { x: number, y: number };
    /**
     * @param {TouchList}  
     */
    constructor(pointers: any | TouchList) {
        this.pointers = [];
        for (let i = 0, len = pointers.length; i < len; i++) {
            let pointer = pointers[i];
            this.pointers[i] = {
                [propX]: Math.round(pointer[propX]),
                [propY]: Math.round(pointer[propY])
            };
        }
        this.center = getCenter(pointers);
        this.timestamp = Date.now();
        this.target = event.target;
    }
}