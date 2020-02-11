import AnyTouch from '@any-touch/core';
import Pinch from '@any-touch/pinch';
import { GestureSimulator, sleep } from '@any-touch/simulator';
function createNode() {
    return document.createElement('div')
}
// test(`通过addEventListener也可响应事件`, async (done) => {
//     AnyTouch.use(Pinch);
//     const el = createNode();
//     const child = createNode();
//     el.appendChild(child);
//     const gs = new GestureSimulator(el);
//     const at = new AnyTouch(el);
//     const onPinch = jest.fn();
//     el.addEventListener('pinch', ev=>{
//         // (ev as any).exact();
//         onPinch();
//     })
//     gs.dispatchTouchStart([{x:1,y:1,target:child},{x:12,y:1,target:child}]);
//     gs.dispatchTouchMove([{x:2,y:2,target:child},{x:200,y:100,target:child}]);
//     gs.dispatchTouchEnd();
//     expect(onPinch).toHaveBeenCalledTimes(1);
//     await sleep();
//     at.destroy();
//     done();
// });

// 
test(`通过"ev.exact()"确保每个触点都是currentTarget的子元素`, async (done) => {
    AnyTouch.use(Pinch);
    const el = createNode();
    const parent = createNode();
    const child = createNode();
    const child2 = createNode();
    el.appendChild(parent);
    parent.appendChild(child);
    parent.appendChild(child2);

    const gs = new GestureSimulator(child);
    new AnyTouch(el);
    const onPinch = jest.fn();
    const onPinchAfterExact = jest.fn();
    child.addEventListener('pinch', ev => {
        onPinch()
        // console.warn((ev as any).exact())
        if ((ev as any).exact()) {
            onPinchAfterExact();
        };
    })
    gs.dispatchTouchStart([{ x: 1, y: 1, target: child }, { x: 12, y: 1, target: child }]);
    gs.dispatchTouchMove([{ x: 2, y: 2, target: child }, { x: 200, y: 100, target: child2 }]);
    gs.dispatchTouchEnd();
    expect(onPinch).toHaveBeenCalledTimes(1);
    expect(onPinchAfterExact).toHaveBeenCalledTimes(0);

    await sleep();
    done();
});