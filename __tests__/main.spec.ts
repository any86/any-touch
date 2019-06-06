// https://jestjs.io/docs/en/manual-mocks
//必须放在第一行
// window.ontouchstart = null; //jest.fn();
import AnyTouch from '../src/main';
// console.log({ global })
test('当前是否移动设备?', () => {
    // console.log(process.env.NODE_ENV);
    // let { jsdom } = <any>global;
    const el = document.createElement('div');
    
    const at = new AnyTouch(el);
    expect(at.touchDevice).toBe('touch');
});