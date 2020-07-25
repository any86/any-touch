import { BaseInput, SupportEvent } from '@any-touch/shared';
// 适配器的抽象类
export default abstract class {
    abstract load(event: SupportEvent,el?:HTMLElement): Omit<BaseInput,'id'> | void
}; 