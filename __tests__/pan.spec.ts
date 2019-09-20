import panSimulator from './utils/Gesture/panSimulator';
import pan2Simulator from './utils/Gesture/pan2Simulator';
import AnyTouch from '../src/main'
import sleep from './utils/sleep';
import TouchSimulator from './utils/TouchSimulator';
test('通过多点pan, 测试Pan构造函数是否正确?', (done) => {
    const el = document.createElement('div');
    const at = new AnyTouch(el, { isPreventDefault: true });
    const pan2 = new AnyTouch.Pan({
        name: 'pan2',
        pointLength: 2,
    })
    at.add(pan2);
    at.on(`pan2`, (ev) => {
        expect(ev.type).toBe('pan2');
    });

    at.on(`pan2end`, (ev) => {
        done();
    });
    // 模拟事件
    pan2Simulator(el, { direction: 'left' });
});

['up', 'right', 'down', 'left'].forEach( (direction) => {
    test(`设置pan的directions为${direction}, pan${direction}是否触发?`, async(done) => {
        const el = document.createElement('div');
        const at = new AnyTouch(el);
        const mockCallback = jest.fn();
        const pan = at.get('pan');
        if(undefined === pan) return;
        pan.set({directions:[direction]});
        at.on(`pan${direction}`, (ev) => {
            mockCallback(ev.direction);
            // console.warn(ev.direction);
        });
    
        panSimulator(el, {direction});
        await sleep(100);
        expect(mockCallback.mock.calls[0][0]).toBe(direction);
        done();
    });
});