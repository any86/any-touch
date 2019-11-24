delete window.ontouchstart;
import TouchSimulator from './utils/TouchSimulator';
import sleep from './utils/sleep';
import Mouse from '../src/input/adapters/Mouse';

test('鼠标非左键点击, 手势识别不会开始',  () => {
    const mouse = new Mouse();
    const el = document.createElement('div');
    const ts = new TouchSimulator(el, {device:'mouse'});
    // mousedown
    let event = ts.dispatchTouchStart([{ x: 0, y: 0 }]);
    event.button = 1;
    let input:any = mouse.load(event);
    expect(input).toBeUndefined();

});

test('按住"左键"后移动鼠标, 是否返回的eventType等于"move"', ()=>{
    const mouse = new Mouse();
    const el = document.createElement('div');
    const ts = new TouchSimulator(el, {device:'mouse'});
    // mousedown
    let event = ts.dispatchTouchStart([{ x: 0, y: 0 }]);
    mouse.load(event);
    // mousemove
    event = ts.dispatchTouchMove([{ x: 100, y: 100 }]);
    const baseInput = mouse.load(event);
    if(void 0 !== baseInput) expect(baseInput.eventType).toBe('move');
});

test('mousedown后直接mouseup, 是否之后的mousemove会返回input为undefined', async () => {
    const mouse = new Mouse();
    const el = document.createElement('div');
    const ts = new TouchSimulator(el, {device:'mouse'});
    // mousedown
    let event = ts.dispatchTouchStart([{ x: 0, y: 0 }]);
    let input:any = mouse.load(event);
    expect(input.eventType).toBe('start');
    expect(input.changedPoints).toEqual([{ clientX: 0, clientY: 0 }]);
    expect(input.points).toEqual([{ clientX: 0, clientY: 0 }]);
    await sleep(100);
    // mouseup
    event = ts.dispatchTouchEnd();
    input = mouse.load(event);
    expect(input.eventType).toBe('end');
    expect(input.changedPoints).toEqual([{ clientX: 0, clientY: 0 }]);
    expect(input.points).toEqual([]);

    // mousemove
    event = ts.dispatchTouchMove([{ x: 100, y: 100 }]);
    input = mouse.load(event);
    expect(input).toBeUndefined();
});