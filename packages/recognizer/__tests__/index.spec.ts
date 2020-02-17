import Tap from '@any-touch/tap';
import Pan from '@any-touch/pan';
import AnyTouch from '@any-touch/core';
import {GestureSimulator, sleep} from '@any-touch/simulator';

test('set传递的参数如果未空, 那么不修改options(此处仅为了提高代码测试覆盖率)', () => {
    AnyTouch.use(Tap);
    const el = document.createElement('div');
    const at = new AnyTouch(el);
    const tap = at.get('tap');
    if(void 0 !== tap){
        const defaultOptions = tap.options;
        tap.set();
        expect(tap.options).toMatchObject(defaultOptions);
    };
    AnyTouch.removeUse('tap');
});


test(`模拟pancancel`, async done=>{
    AnyTouch.use(Pan);
    const el = document.createElement('div');
    const gs = new GestureSimulator(el);
    const at = new AnyTouch(el);
    const onPan = jest.fn().mockName('onPan');
    const onPanCancel = jest.fn().mockName('onPanCancel');

    at.on('pan', onPan);
    at.on('pancancel', onPanCancel);
    gs.dispatchTouchStart();
    gs.dispatchTouchMove([{x:10,y:0}]);
    gs.dispatchTouchMove([{x:20,y:0}]);
    gs.dispatchTouchMove([{x:30,y:0}]);
    gs.dispatchTouchCancel();
    await sleep();
    // expect(onPan).toHaveBeenCalledTimes(2);
    expect(onPanCancel).toHaveBeenCalledTimes(1);
    done();
});
