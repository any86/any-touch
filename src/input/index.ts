/**
 * 构造统一的Input格式
 */
import { BaseInput, SupportEvent } from '@/types';
import { SUPPORT_TOUCH } from '@/const';
import Touch from './adapters/Touch';
import Mouse from './adapters/Mouse';
import Adapter from './adapters/Abstract';

export default class {
    public adapter: Adapter;
    public id: number;
    constructor() {
        this.adapter = SUPPORT_TOUCH ? new Touch() : new Mouse();
        this.id = 0;
    };

    public load(event: SupportEvent): BaseInput | void {
        // 从event中采集的数据
        const input = this.adapter.load(event);
        if (void 0 !== input) {
            const id = Number.MAX_SAFE_INTEGER > this.id ? ++this.id : 1
            return { ...input, id };
        }
    };
}