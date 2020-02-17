import { create } from '@testUtils';
import Pan from '@any-touch/pan';
import AnyTouch from '@any-touch/core';
import {panSimulator,sleep} from '@any-touch/simulator'
const PAN_NAME = 'pan';

test(`加载${PAN_NAME}, 触发一次${PAN_NAME}`, async done => {
    const { gs, el, mockCB, sleep, AnyTouch } = create();
    AnyTouch.use(Pan);
    const at = new AnyTouch(el);
    at.on(PAN_NAME, ev => {
        mockCB(ev.type)
    });
    gs.dispatchTouchStart();
    gs.dispatchTouchMove([{ x: 0, y: 11 }]);
    gs.dispatchTouchMove([{ x: 0, y: 21 }]);
    gs.dispatchTouchMove([{ x: 0, y: 31 }]);
    gs.dispatchTouchEnd();
    await sleep();
    expect(mockCB).toHaveBeenCalledTimes(3);
    expect(mockCB).toHaveBeenNthCalledWith(1, PAN_NAME);
    done();
});

test(`向下拖拽, 触发${PAN_NAME}down`, async done => {
    const el = document.createElement('div');
    const at = new AnyTouch(el);
    const mockCB = jest.fn();
    at.on(`${PAN_NAME}down`, ev => {
        mockCB(ev.type)
    });
  
    panSimulator(el,{direction:'down',distance:100});
    await sleep();
    expect(mockCB).toHaveBeenCalledTimes(1);
    expect(mockCB).toHaveBeenNthCalledWith(1, `${PAN_NAME}down`);
    // 此处增加panright操作会报错, 实际页面并没有报错, 后续需要检查是否touch模拟器写的有问题
    done();
});

