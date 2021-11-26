import Core from '@any-touch/core';
import pinch from '@any-touch/pinch';
import { GestureSimulator, sleep } from '@any-touch/simulator';
function createNode(id = "test") {
    const el = document.createElement('div');
    el.setAttribute('id', id);
    return el;
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
//         // (ev as any).match();
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
test(`通过"ev.match()"确保每个触点都是currentTarget的子元素`, async (done) => {
    const el = createNode();
    const parent = createNode();
    const child = createNode('child');
    const child2 = createNode('child-2');
    el.appendChild(parent);
    parent.appendChild(child);
    parent.appendChild(child2);

    const gs = new GestureSimulator(child);
    const at = new Core(el);
    at.use(pinch)
    const onPinch = jest.fn();
    const onPinchAftermatch = jest.fn();
    child.addEventListener('pinch', ev => {
        onPinch()
        // console.warn((ev as any).match())
        const e = ev as any;
        if (e.match()) {
            onPinchAftermatch();
        };
    })
    gs.start([{ x: 1, y: 1, target: child }, { x: 12, y: 1, target: child }]);
    gs.move([{ x: 2, y: 2, target: child }, { x: 200, y: 100, target: child2 }]);
    gs.end();
    expect(onPinch).toHaveBeenCalledTimes(2);
    // pinchend阶段触发的时间对象上
    expect(onPinchAftermatch).toHaveBeenCalledTimes(0);

    await sleep();
    done();
});