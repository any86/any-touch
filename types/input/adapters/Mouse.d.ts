import { BaseInput } from '../../interface';
import Adapter from './Abstract';
export default class extends Adapter {
    prevPoints?: {
        clientX: number;
        clientY: number;
    }[];
    isPressed: boolean;
    constructor();
    load(event: MouseEvent): BaseInput | void;
}
