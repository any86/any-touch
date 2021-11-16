import { KV, RECOGNIZER_STATE, Computed } from './types';
import { STATE_POSSIBLE } from './const';
import Core from '@any-touch/core';
export default abstract class {
    // 插件状态
    protected state?: RECOGNIZER_STATE;
    protected options?: { name?: string } & KV;

    constructor(context: Core, options?: { name: string } & KV) {
        this.options = options;
        this.state = STATE_POSSIBLE;
        context.on('computed', this.onComputed);
    };

    abstract onComputed(computed: Computed): void
};