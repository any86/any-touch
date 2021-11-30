import dispatchDomEvent from '../src/dispatchDomEvent';
import { create } from '../../../testUtils';
test('触发自定义事件', () => {
    const EVENT_NAME = 'xyz'
    const { el, mockCB, sleep } = create();
    el.addEventListener(EVENT_NAME, ev => {
        mockCB(ev.type);
    });
    dispatchDomEvent(EVENT_NAME,el,{});
    sleep();
    expect(mockCB).toHaveBeenCalledWith(EVENT_NAME);
});

test('当Event不存的时候, 依然可以触发事件', ()=>{

    (document as any).createEvent = void 0;
    const EVENT_NAME = 'xyz'
    const { el, mockCB, sleep } = create();
    el.addEventListener(EVENT_NAME, ev => {
        mockCB(ev.type);
    });
    dispatchDomEvent(EVENT_NAME,el, {} as any);
    sleep();
    expect(mockCB).toHaveBeenCalledWith(EVENT_NAME);
});