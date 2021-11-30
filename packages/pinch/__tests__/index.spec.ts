import AT from 'any-touch';
import Core from '@any-touch/core';
import pinch from '@any-touch/pinch';
import { GestureSimulator, sleep } from '@any-touch/simulator';

test(`双手捏合缩小`, async done => {
    const el = document.createElement('div');
    const at = new AT(el);
    const gs = new GestureSimulator(el);
    const onPinch = jest.fn();
    const onPinchStart = jest.fn();
    const onPinchMove = jest.fn();
    const onPinchEnd = jest.fn();

    at.on(`pinch`, onPinch);
    at.on(`pinchstart`, e=>{
        onPinchStart(e.scale);
    });
    at.on(`pinchmove`, e=>{
        onPinchMove(e.scale);
    });
    at.on(`pinchend`, e=>{
        onPinchEnd(e.scale);
    });

    gs.start([{ x: 0, y: 0 }, { x: 10, y: 0 }]);
    gs.move([{ x: 0, y: 0 }, { x: 20, y: 0 }]); // pinchstart 2
    gs.move([{ x: 0, y: 0 }, { x: 30, y: 0 }]); // pinchmove 3
    gs.end();
    await sleep();
    expect(onPinch).toHaveBeenCalledTimes(3);
    expect(onPinchStart).toHaveBeenCalledTimes(1);
    expect(onPinchStart).toBeCalledWith(2);

    expect(onPinchMove).toHaveBeenCalledTimes(1);
    expect(onPinchMove).toBeCalledWith(3);

    expect(onPinchEnd).toHaveBeenCalledTimes(1);
    expect(onPinchEnd).toBeCalledWith(3);

    done();
});