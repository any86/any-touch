import { create } from '@testUtils';
import Input from '../src/Input/index';

test(`preventDefault.spec`, () => {
    const { AnyTouch, el, GestureSimulator, mockCB, sleep } = create();
    const inputFactory = new Input('touch');
    const gs = new GestureSimulator(el);
    const event = gs.dispatchTouchStart();
    const input = inputFactory.transform(event);
    expect(input).not.toBeUndefined();
    if(void 0 !== input){
        input.preventDefault();
        expect(input.nativeEvent.defaultPrevented).toBeTruthy();
    }
});