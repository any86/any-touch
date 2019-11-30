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
    constructor() {
        this.adapter = SUPPORT_TOUCH ? new Touch() : new Mouse();
    };

    public load(event: SupportEvent): BaseInput | void {
        // 从event中采集的数据
        return this.adapter.load(event);
    };
}