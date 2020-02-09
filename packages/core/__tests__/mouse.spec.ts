import Mouse from '../src/Input/adapters/Mouse';
import { GestureSimulator } from '@any-touch/simulator';

test('鼠标输入move-> start-> move-> end', async done => {
    const mouse = new Mouse();
    const el = document.createElement('div');
    const gs = new GestureSimulator(el, { device: 'mouse' });
    // const mockCallback = jest.fn();
    // 直接输入move会
    const event1 = gs.dispatchTouchMove([{ x: 1, y: 1 }]);
    expect(mouse.load(event1)).toBeUndefined();

    const event2 = gs.dispatchTouchStart();
    expect(mouse.load(event2)).toHaveProperty(['points'], [{ "clientX": 0, "clientY": 0,target:el }]);


    const event3 = gs.dispatchTouchMove([{ x: 1, y: 1 }]);
    expect(mouse.load(event3)).toHaveProperty(['points'], [{ "clientX": 1, "clientY": 1,target:el }]);

    const event4 = gs.dispatchTouchEnd();
    expect(mouse.load(event4)).toHaveProperty('inputType', 'end');


    // const event5 = gs.dispatchTouchStart();
    // expect(mouse.load(event5)).toHaveProperty(['points'], [{ "clientX": 0, "clientY": 0 }]);
    // const event6 = gs.dispatchTouchEnd();
    // expect(mouse.load(event6)).toHaveProperty('inputType', 'end');

    done();
});