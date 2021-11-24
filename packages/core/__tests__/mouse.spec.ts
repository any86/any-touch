import Mouse from '../src/createInput/mouse';
import { GestureSimulator } from '@any-touch/simulator';

test('鼠标输入move-> start-> move-> end', async done => {
    const mouseLoader = Mouse();
    const el = document.createElement('div');
    const gs = new GestureSimulator(el, { device: 'mouse' });

    const event2 = gs.start();
    expect(mouseLoader(event2)).toHaveProperty(['points'], [{ "clientX": 0, "clientY": 0,target:el }]);


    const event3 = gs.move([{ x: 1, y: 1 }]);
    expect(mouseLoader(event3)).toHaveProperty(['points'], [{ "clientX": 1, "clientY": 1,target:el }]);

    const event4 = gs.end();
    expect(mouseLoader(event4)).toHaveProperty('phase', 'end');
    done();
});


test('没有按住, 直接move返回undefined', done=>{
    const mouseLoader = Mouse();
    const el = document.createElement('div');
    const gs = new GestureSimulator(el, { device: 'mouse' });
    const event = gs.move([{x:1,y:1}]);
    expect(mouseLoader(event)).not.toBeDefined();
    done();
});