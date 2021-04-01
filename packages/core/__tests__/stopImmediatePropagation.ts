import AnyTouch from '@any-touch/core';
import Tap from '@any-touch/tap';
import { GestureSimulator, sleep } from '@any-touch/simulator';
function createNode() {
    return document.createElement('div')
}


// 
test(`stopImmediatePropagation`, async (done) => {
    AnyTouch.use(Tap);
    const el = createNode();
    const parent = createNode();
    const tapEl = createNode();
    parent.appendChild(el);
    el.appendChild(tapEl);

    const gs = new GestureSimulator(tapEl);
    const at = new AnyTouch(el);
    const pAt = new AnyTouch(parent);

    const onTap = jest.fn();
    const onPTap = jest.fn();
    
    at.on('tap', e=>{
        e.stopImmediatePropagation();
        onTap();
    })
    pAt.on('tap', onPTap)
    gs.start();
    await sleep();
    gs.end();
    expect(onTap).toHaveBeenCalledTimes(1);
    expect(onPTap).toHaveBeenCalledTimes(0);
    await sleep();
    done();
});