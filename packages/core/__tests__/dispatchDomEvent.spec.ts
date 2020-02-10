import dispatchDomEvent from '../src/dispatchDomEvent';
import { create } from '../../../testUtils';
test('触发自定义事件', () => {
    const EVENT_NAME = 'xyz'
    const { el, mockCB, sleep } = create();
    el.addEventListener(EVENT_NAME, ev => {
        mockCB(ev.type);
    });
    dispatchDomEvent(el, { type: EVENT_NAME } as any);
    sleep();
    expect(mockCB).toHaveBeenCalledWith(EVENT_NAME);
});