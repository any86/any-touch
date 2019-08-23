import { Input, SupportEvent } from '../interface';
import Adapter from './adapters/Abstract';
export default class {
    private _center?;
    adapter: Adapter;
    constructor();
    load(event: SupportEvent): Input | void;
}
