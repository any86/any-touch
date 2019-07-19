import { BaseInput, SupportEvent } from '../../interface';
// 适配器的抽象类
export default abstract class {
    abstract load(event: SupportEvent): BaseInput|void
}; 