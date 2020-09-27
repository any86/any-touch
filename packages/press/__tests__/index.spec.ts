import { create } from '@testUtils';
import Press from '@any-touch/press';
const PRESS_NAME = 'press';

test(`加载${PRESS_NAME}, 触发一次${PRESS_NAME}`, async done => {
    const { gs, el, mockCB, mockCalls, sleep, AnyTouch } = create();
    const at = AnyTouch(el);
    at.use(Press);
    at.on(PRESS_NAME, mockCB);

    gs.dispatchTouchStart();
    await sleep(251);
    gs.dispatchTouchEnd();
    await sleep();
    expect(mockCalls[0][0].type).toBe(PRESS_NAME);
    done();
});

test(`按压的时候移动超过一定"距离", 不触发${PRESS_NAME}`, async done => {
    const { gs, el, mockCB, sleep, AnyTouch } = create();
    const at = AnyTouch(el);
    at.use(Press);
    at.on(PRESS_NAME, mockCB);

    gs.dispatchTouchStart();
    gs.dispatchTouchMove([{x:10,y:10}]);
    await sleep(251);
    gs.dispatchTouchEnd();
    await sleep();
    expect(mockCB).not.toHaveBeenCalled();
    done();
});

test(`松手的时候还没有构成按压时间要求, 不触发${PRESS_NAME}`, async done => {
    const { gs, el, mockCB, sleep, AnyTouch } = create();
    const at = AnyTouch(el);
    at.use(Press);
    at.on(PRESS_NAME, mockCB);

    gs.dispatchTouchStart();
    await sleep(200);
    gs.dispatchTouchEnd();
    await sleep();
    expect(mockCB).not.toHaveBeenCalled();
    done();
});