import { BaseInput, SupportEvent } from '@/types';
// 适配器的抽象类
export default abstract class {
    abstract load(event: SupportEvent): BaseInput|void
}; 