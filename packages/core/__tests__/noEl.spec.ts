import AnyTouch from '../src/index';
import { GestureSimulator, sleep } from '@any-touch/simulator';

test(`模拟微信下没有el,通过catchEvent接收数据从而识别手势`, async (done) => {
    const at = new AnyTouch();
    const el = document.createElement('div');
    const gs = new GestureSimulator(el);
    const event = gs.start();
    const onInput = jest.fn();
    at.on('at',onInput);
    at.catchEvent(event);
    await sleep();
    expect(onInput).toHaveBeenCalledTimes(1);
    // 销毁
    at.destroy();
    at.on('at',onInput);
    expect(onInput).toHaveBeenCalledTimes(1);
    done();
});