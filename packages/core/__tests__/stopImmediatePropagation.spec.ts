import Core from '@any-touch/core';
import tap from '@any-touch/tap';
import { GestureSimulator, sleep } from '@any-touch/simulator';
function createNode() {
    return document.createElement('div')
}

test(`stopImmediatePropagation`, async (done) => {
    const el = createNode();
    const parent = createNode();
    const tapEl = createNode();
    parent.appendChild(el);
    el.appendChild(tapEl);

    const gs = new GestureSimulator(tapEl);
    const at = new Core(el);
    at.use(tap);
    const pAt = new Core(parent);
    pAt.use(tap);

    const onTap = jest.fn();
    const onPTap = jest.fn();
    
    at.on('tap', e=>{
        // 绑定的同类事件就不触发了
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