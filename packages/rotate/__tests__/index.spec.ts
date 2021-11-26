import { create } from '@testUtils';
import rotate from '@any-touch/rotate';
import Core from '@any-touch/core';
import { sleep, rotateSimulator } from '@any-touch/simulator';

test(`顺时针旋转10度, 然后逆时针旋转20度`, async done => {
    const el = document.createElement('div');
    const at = new Core(el);
    at.use(rotate);
    const onRotate = jest.fn();
    const onRotateStart = jest.fn();
    const onRotateMove = jest.fn();
    const onRotateEnd = jest.fn();

    at.on('rotate', onRotate);
    at.on('rotatestart', onRotateStart);
    at.on('rotatemove', onRotateMove);
    at.on('rotateend', onRotateEnd);

    rotateSimulator(el, [10, -20]);
    await sleep();
    expect(onRotate).toHaveBeenCalledTimes(3);
    expect(onRotateStart).toHaveBeenCalledTimes(1);
    expect(onRotateMove).toHaveBeenCalledTimes(1);
    expect(onRotateEnd).toHaveBeenCalledTimes(1);

    done();
});