import { BaseInput, SupportEvent } from '../../interface';
export default abstract class {
    abstract load(event: SupportEvent): BaseInput | void;
}
