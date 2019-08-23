import { Input, SupportEvent, AnyTouchEvent, Store } from './interface';
import InputFactory from './input';
export default class {
    startInput?: Input;
    prevInput?: Input;
    activeInput?: Input;
    startMultiInput?: Input;
    inputFactory: InputFactory;
    $store: Store;
    constructor({ $store }: {
        $store: Store;
    });
    load(event: SupportEvent): AnyTouchEvent | void;
    private _record;
}
