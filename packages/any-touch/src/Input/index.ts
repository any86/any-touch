/**
 * 构造统一的Input格式
 */
import { EventTransform, SupportEvent } from '@types';
import Touch from './adapters/Touch';
import Mouse from './adapters/Mouse';
import Adapter from './adapters/Abstract';
import { MOUSE, TOUCH } from '@const'
export default class {
    public adapter: Adapter;
    public id: number;
    constructor(sourceType: typeof MOUSE | typeof TOUCH) {
        const SOURCE = {
            [MOUSE]:  Mouse,
            [TOUCH]: Touch
        } [sourceType];

        this.adapter = new SOURCE();
        this.id = 0;
    };

    public load(event: SupportEvent): EventTransform | void {
        // 从event中采集的数据
        const input = this.adapter.load(event);
        if (void 0 !== input) {
            const id = Number.MAX_SAFE_INTEGER > this.id ? ++this.id : 1
            return { ...input, id };
        }
    };
}