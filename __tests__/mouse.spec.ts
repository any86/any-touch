delete window.ontouchstart;
import TouchSimulator from './utils/TouchSimulator';
import sleep from './utils/sleep';
import mouse from '../src/input/adapters/mouse';

test('mouseup后紧接着mousedown, 是否之后的mousemove会返回input为undefined', async (done) => {
    const el = document.createElement('div');
    const ts = new TouchSimulator(el, {device:'mouse'});
    // mousedown
    let event = ts.dispatchTouchStart([{ x: 0, y: 0 }]);
    let input:any = mouse(event);
    expect(input.inputStatus).toBe('start');
    expect(input.changedPointers).toEqual([{ clientX: 0, clientY: 0 }]);
    expect(input.pointers).toEqual([{ clientX: 0, clientY: 0 }]);
    await sleep(100);
    // mouseup
    event = ts.dispatchTouchEnd();
    input = mouse(event);
    expect(input.inputStatus).toBe('end');
    expect(input.changedPointers).toEqual([{ clientX: 0, clientY: 0 }]);
    expect(input.pointers).toEqual([]);

    // mousemove
    event = ts.dispatchTouchMove([{ x: 100, y: 100 }]);
    input = mouse(event);
    expect(input).toBeUndefined();

    done();
});