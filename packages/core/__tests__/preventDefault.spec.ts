import { create } from '@testUtils';
import { sleep } from '@any-touch/simulator';
import Touch from '../src/createInput/touch';
import AnyTouch from 'any-touch';

test(`preventDefault.spec`, () => {
    const { el, GestureSimulator } = create();
    const touchLoader = Touch();
    const gs = new GestureSimulator(el);
    const event = gs.start();
    const input = touchLoader(event);
    expect(input).not.toBeUndefined();
    if (void 0 !== input) {
        input.nativeEvent.preventDefault();
        expect(input.nativeEvent.defaultPrevented).toBeTruthy();
    }
});

test(`preventDefault == false的时候, touch如果触发了, 那么mouse不触发`, () => {
    const { GestureSimulator } = create();
    const el = document.createElement('div');
    const at = new AnyTouch(el, { preventDefault: false });
    const mouse = new GestureSimulator(el, { device: 'mouse' });
    const touch = new GestureSimulator(el, { device: 'touch' });
    const onTap = jest.fn();
    at.on('tap', onTap);

    touch.start();
    touch.end();
    mouse.start();
    mouse.end();

    expect(onTap).toBeCalledTimes(1);
});

test(`preventDefault == false的时候, touch如果触发了, 那么mouse不触发`, () => {
    const { GestureSimulator } = create();
    const el = document.createElement('div');
    const at = new AnyTouch(el, { preventDefault: false });
    const mouse = new GestureSimulator(el, { device: 'mouse' });
    const touch = new GestureSimulator(el, { device: 'touch' });
    at.on('tap', e => {
        expect(e.nativeEvent.type).toBe('mouseup');
    })
    touch.start()

    // 通过touchmove来解除对mouse的限制
    // https://github.com/any86/any-touch/blob/8acfa08ab40be43524cc64dfab30f0437b737023/packages/core/src/index.ts#L232
    touch.move([{ x: 10, y: 0 }]);
    touch.end();
    mouse.start();
    mouse.end();
});


