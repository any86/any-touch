import Mouse from '../src/createInput/mouse';
import { GestureSimulator } from '@any-touch/simulator';

test('鼠标输入move-> start-> move-> end', async done => {
    const mouseLoader = Mouse();
    const el = document.createElement('div');
    const gs = new GestureSimulator(el, { device: 'mouse' });
    // const mockCallback = jest.fn();
    // 直接输入move会
    const event1 = gs.move([{ x: 1, y: 1 }]);
    expect(mouseLoader(event1)).toBeUndefined();

    const event2 = gs.start();
    expect(mouseLoader(event2)).toHaveProperty(['points'], [{ "clientX": 0, "clientY": 0,target:el }]);


    const event3 = gs.move([{ x: 1, y: 1 }]);
    expect(mouseLoader(event3)).toHaveProperty(['points'], [{ "clientX": 1, "clientY": 1,target:el }]);

    const event4 = gs.end();
    expect(mouseLoader(event4)).toHaveProperty('stage', 'end');


    // const event5 = gs.dispatchTouchStart();
    // expect(mouseLoader(event5)).toHaveProperty(['points'], [{ "clientX": 0, "clientY": 0 }]);
    // const event6 = gs.dispatchTouchEnd();
    // expect(mouseLoader(event6)).toHaveProperty('stage', 'end');

    done();
});