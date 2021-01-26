import { create } from '@testUtils';
import Touch from '../src/createInput/touch';

test(`preventDefault.spec`, () => {
    const {el, GestureSimulator} = create();
    const touchLoader = Touch();
    const gs = new GestureSimulator(el);
    const event = gs.start();
    const input = touchLoader(event);
    expect(input).not.toBeUndefined();
    if(void 0 !== input){
        input.nativeEvent.preventDefault();
        expect(input.nativeEvent.defaultPrevented).toBeTruthy();
    }
});