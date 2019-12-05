// import TouchSimulator from './utils/TouchSimulator';
// import sleep from './utils/sleep';
import AnyTouch from '../src/main'
const el = document.createElement('div');
// const childEl = document.createElement('input');
// childEl.type = 'checkbox';
// // input
// el.appendChild(childEl);

// 暂时没想到如何触发元素的默认行为, 所以没法完美还原实际情况
test('preventDefaultExclude通过函数指定排除', async (done) => {
    const at = new AnyTouch(el, {
        isPreventDefault:true,
        preventDefaultExclude(ev) {
            return 'div' === (<any>ev).target.tagName;
        }
    });
    const canPreventDefault = at.canPreventDefault((<any>{ target: { tagName: 'div' } }));
    expect(canPreventDefault).toBeFalsy();
    done();
});




