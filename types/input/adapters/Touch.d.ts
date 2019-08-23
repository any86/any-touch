import { BaseInput } from '../../interface';
import Adapter from './Abstract';
export default class extends Adapter {
    load(event: TouchEvent): BaseInput;
}
