// 此文件只由于强制mouse所以不能测试touch相关逻辑
// 强制识别为Mouse
// !必须放在最顶部
delete window.ontouchstart;
import bindElement from '../src/bindElement';
import { GestureSimulator, sleep } from '@any-touch/simulator';

test(`mouse下产生一次输入, bindElement触发一次`, async (done) => {
    const el = document.createElement('div');
    const gs = new GestureSimulator(el, { device: 'mouse' });
    const mockCallback = jest.fn();
    const unbind  = bindElement(el, ev => {
        mockCallback(ev);
    });
    gs.dispatchTouchStart();
    gs.dispatchTouchMove([{x:10,y:90}]);
    gs.dispatchTouchEnd();
    await sleep();
    expect(mockCallback).toHaveBeenCalledTimes(3);
    expect(mockCallback.mock.calls[1][0]).toHaveProperty('clientX',10);
    expect(mockCallback.mock.calls[1][0]).toHaveProperty('clientY',90);


    // 解绑事件
    unbind();
    gs.dispatchTouchStart();
    gs.dispatchTouchMove([{x:10,y:90}]);
    gs.dispatchTouchEnd();
    await sleep();
    expect(mockCallback).toHaveBeenCalledTimes(3);
    done();
});