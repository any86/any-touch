import { BaseInput, SupportEvent } from '@any-touch/shared/types';
// 适配器的抽象类
export default abstract class {
    abstract load(event: SupportEvent): Omit<BaseInput,'id'> | void |void
}; 